import { db } from "../config/db";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

const TBL_NAME = "tbl_users";

export interface User {
    user_id: string;
    firstname: string;
    lastname: string;
    username: string;
    password: string;
    email: string;
    position: string;
}

// Query for new user registration
export async function insert(user: User) {
    try {
        const userId = uuidv4();
        user.password = await bcrypt.hash(user.password, 10);
        await db<User>(TBL_NAME).insert(user);
        return userId;
    } catch (error) {
        console.log(error);
        throw new Error((<any>error).code);
    }
}

// Query for finding user by email
export async function findByEmail(email: string) {
    try {
        const result = await db<User>(TBL_NAME).select().where("email", email);

        return result[0];
    } catch (error) {
        throw new Error((<any>error).code);
    }
}

// Query for finding user by user_id
export async function findById(id: string) {
    try {
        const result = await db<User>(TBL_NAME).select().where("user_id", id);
        return result[0];
    } catch (error) {
        throw new Error((<any>error).code);
    }
}

export async function findAll() {
    try {
        const result = await db
            .select('tbl_users.user_id', 'tbl_users.firstname', 'tbl_users.lastname', 'tbl_users.email', "tbl_users.position")
            .sum('tbl_records.amount as total_expense')
            .from('tbl_users')
            .leftJoin('tbl_records', 'tbl_users.user_id', 'tbl_records.user_id')
            .groupBy('tbl_users.user_id', 'tbl_users.firstname', 'tbl_users.lastname', 'tbl_users.email', "tbl_users.position");

        return result;
    } catch (error) {
        console.log(error);
        throw new Error((<any>error).code);
    }
}

export async function searchUserByName(query: string) {
    try {
        const result = await db(TBL_NAME)
            .select('tbl_users.user_id', 'tbl_users.firstname', 'tbl_users.lastname', 'tbl_users.email', "tbl_users.position")
            .sum('tbl_records.amount as total_expense')
            .from('tbl_users')
            .whereILike("firstname", `%${query}%`)
            .orWhereILike("lastname", `%${query}%`)
            .leftJoin('tbl_records', 'tbl_users.user_id', 'tbl_records.user_id')
            .groupBy('tbl_users.user_id', 'tbl_users.firstname', 'tbl_users.lastname', 'tbl_users.email', "tbl_users.position");

        return result;
    } catch (error) {
        throw new Error((<any>error).code);
    }
}

export async function updatePasswordById(userId: string, password: string) {
    try {
        password = await bcrypt.hash(password, 10);
        const result = await db<User>(TBL_NAME)
        .update("password", password)
        .where("user_id", userId);

        return result;
    } catch (error) {
        throw new Error((<any>error).code);
    }
}

export async function deleteUser(userId: string) {
    try {
        const result = await db<User>(TBL_NAME).delete().where("user_id", userId);
        return result;
    } catch (error) {
        throw new Error((<any>error).code);
    }
}