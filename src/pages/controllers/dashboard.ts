import { Request, Response } from "express";
import { db } from "../../config/db";

export async function dashboardPage(req: Request, res: Response) {
    let sql = `SELECT CONCAT(firstname, " ", lastname) as name, email, position, SUM(amount) as total_amount 
    FROM tbl_users
    LEFT JOIN tbl_records ON tbl_records.user_id = tbl_users.user_id
    GROUP BY tbl_users.user_id;`;
    const result = await db.raw(sql);

    return res.render("index", {data: {
        keys: ["Name", "Email", "Position", "Total Amount"],
        result: result[0]
    }});
}