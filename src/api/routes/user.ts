import { Router } from "express";
import { db } from "../../config/db";


const router = Router();

router.get('/search-user', async (req, res) => {
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

        return res.status(200).json(result[0]);
})

export default router;