import { db } from "../config/db";

const TBL_NAME = "tbl_records";
const cols = ['record_id', 'category', 'note', 'amount', 'created_at'];

export interface Record {
    record_id: string;
    category: string;
    note: string;
    amount: number;
    user_id: string;
    created_at: Date;
    delete_time: Date | null;
}

type Option = {
    page?: number,
    per_page?: number,
    limit?: number,
    q?: string,
    cols?: (keyof Record)[],
    recordOpt?: {
        deleted: boolean
    }
};

export async function insert(data: Record) {
    const res = await db<Record>(TBL_NAME).insert(data);
    return res;
}

export async function select(userId: string, opt?: Option) {
    const defaultPageItems = 10;

    let sql = `
    SELECT ${opt?.cols ?? cols.join(', ')} FROM ${TBL_NAME}
    WHERE ${!opt?.recordOpt?.deleted ? '(user_id = ? AND delete_time IS NULL)' : 'user_id = ? AND delete_time IS NOT NULL'} `;

    // Apply search
    if (opt?.q) sql += `AND (note LIKE '%${opt.q}%' OR category LIKE '%${opt.q}%') `;

    // Order result (latest first)
    sql += `ORDER BY created_at DESC `;

    // Apply pagination
    if (opt?.page) {
        opt.per_page = opt.per_page ?? defaultPageItems;
        sql += `LIMIT ${opt.per_page} OFFSET ${(opt.page - 1) * opt.per_page} `;
    } else if (opt?.limit) {
        sql += `LIMIT ${opt.limit} `;
    }

    const res = await db.raw(sql, [userId]);

    return res[0];
}

export async function selectById(recordId: string) {
    const result = db<Record>(TBL_NAME).select()
        .where('record_id', recordId);

    return (await result)[0];
}

// Get overview of records/transactions
export async function getOverview(userId: string) {
    try {
        let rows = await db<Record>(TBL_NAME)
            .column("category")
            .sum({ total_expense: "amount" })
            .groupBy("category")
            .where("user_id", userId)
            .andWhere('delete_time', null);

        let totalSum = rows.reduce((sum, row) =>
            sum + row.total_expense, 0);

        let result = rows.map(row => ({
            category: row.category,
            total_expense: row.total_expense,
            percentage: parseFloat(((row.total_expense / totalSum) * 100).toFixed(2))
        }));

        return result;
    } catch (error) {
        throw new Error((<any>error).code);
    }
}


export async function update(id: string, data: any) {
    const matchedRecord = (await db<Record>(TBL_NAME).select().where('record_id', id))[0];

    // Store the previous version to another table
    await db('tbl_previous_records').insert({
        record_id: matchedRecord.record_id,
        category: matchedRecord.category,
        note: matchedRecord.note,
        amount: matchedRecord.amount,
        user_id: matchedRecord.user_id,
        update_time: new Date()
    });

    // Update the record
    const res = await db<Record>(TBL_NAME).update(data).where('record_id', id);

    return res;
}

export async function softDelete(id: string) {
    const res = await db<Record>(TBL_NAME).update({ 'delete_time': new Date() }).where('record_id', id);
    return res;
}

export async function hardDelete(id: string) {
    const res = await db<Record>(TBL_NAME).delete().where('record_id', id);
    return res;
}


export async function restore(id: string) {
    const res = await db<Record>(TBL_NAME).update({ 'delete_time': null }).where('record_id', id);
    return res;
}