import { Request, Response } from "express";
import { db } from "../../config/db";
import { validateUser } from "../../utils/validators";

import * as UserRepo from "../../repository/user";

export async function dashboardPage(req: Request, res: Response) {
    let q = req.query.q;

    let sql = `SELECT tbl_users.user_id as user_id, CONCAT(firstname, " ", lastname) as name, email, position, SUM(amount) as total_amount 
    FROM tbl_users
    LEFT JOIN tbl_records ON tbl_records.user_id = tbl_users.user_id
    WHERE tbl_records.delete_time IS NULL `;

    if (q) sql += 'AND firstname LIKE ? OR lastname LIKE ? OR email LIKE ? ' 

    sql += `GROUP BY tbl_users.user_id;`;

    const result = await db.raw(sql, q ? [
        `%${q}%`,
        `%${q}%`,
        `%${q}%`,
        ]: []);

    return res.render("index", {
        message: req.flash('message')[0] ?? "",
        data: {
            keys: ["Name", "Email", "Position", "Expense Amount"],
            result: result[0]
        }
    });
}


export async function expenseOverview(req: Request, res: Response) {
    let userId = req.params.user_id;

    let expensePage = parseInt(req.query.page + '' ?? '1');
    let expensePageLimit = 10;

    if (Number.isNaN(expensePage)) expensePage = 1;


    let expenseTotalSQl = `SELECT SUM(amount) as total 
    FROM tbl_records 
    WHERE user_id = '${userId}' 
    AND delete_time IS NULL`;

    let expensesSQL = `SELECT * 
    FROM tbl_records
    WHERE user_id = '${userId}'
    ${!req.query.status ? '' : req.query.status == 'active' ? 'AND delete_time IS NULL' : 'AND delete_time IS NOT NULL'}
    ORDER BY created_at DESC
    LIMIT 10 OFFSET ${(expensePage - 1) * 10}`;

    let recentlyDeletedSQL = `SELECT * 
    FROM tbl_records
    WHERE user_id = '${userId}'
    AND delete_time IS NULL
    ORDER BY delete_time DESC
    LIMIT 5`;

    let countExpensesSQL = `SELECT COUNT(*) as itemCount 
    FROM tbl_records WHERE user_id = '${userId}' 
    ${!req.query.status ? '' : req.query.status == 'active' ? 'AND delete_time IS NULL' : 'AND delete_time IS NOT NULL'}
    `;

    let amountPerCategorySQL = `
    SELECT category, SUM(amount) as amount FROM tbl_records 
    WHERE user_id = '${userId}'
    AND delete_time IS NULL
    GROUP BY category;
    `;

    const amountPerCategory = await db.raw(amountPerCategorySQL);
    const expenseTotal = await db.raw(expenseTotalSQl);
    const expenses = await db.raw(expensesSQL);
    let recentlyDeleted = await db.raw(recentlyDeletedSQL);

    let countExpenses = await db.raw(countExpensesSQL);


    console.log(amountPerCategory);

    res.render("expense-overview", {
        error: req.flash('error')[0] ?? "",
        message: req.flash('message')[0] ?? "",
        userId,
        data: {
            expenseTotal: Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 2 }).format(expenseTotal[0][0].total ?? 0),
            expenses: {
                items: expenses[0],
                page: expensePage,
                pageLimit: expensePageLimit,
                itemCount: countExpenses[0][0].itemCount,
                amountPerCategory: amountPerCategory[0],
                total: expenseTotal[0][0].total
            },
            recentlyDeleted: {
                items: recentlyDeleted[0],
                limit: 5
            },
            currentUrl: `${req.protocol}://${req.get('host')}${req.originalUrl}`
        }
    });
}


export async function addUserPage(req: Request, res: Response) {
    const error = req.flash('error');
    const fields = req.flash('fields');

    return res.render("add-user", {
        error: error[0],
        fields: fields[0] ? JSON.parse(fields[0]) :
            {
                firstname: "",
                lastname: "",
                email: "",
                password: "",
                confirmPassword: ""
            }
    });
}


export async function addUser(req: Request, res: Response) {
    const error = await validateUser(req.body);

    if (error) {
        req.flash('error', error);
        req.flash('fields', JSON.stringify(req.body));

        return res.redirect("/add-user");
    }

    // Dapat dili ni kaabot sa database
    delete req.body.confirmPassword;

    await UserRepo.insert(req.body);

    req.flash('message', 'User added successfully');

    return res.redirect("/");
}