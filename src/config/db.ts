import knex from "knex";

const db = knex({
    client: "mysql",
    connection: {
        host: "localhost",
        port: 3306,
        user: "root",
        database: "expense_tracker_db"
    }
});

export { db };