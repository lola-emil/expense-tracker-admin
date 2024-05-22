import Joi from "joi"
import { Admin } from "../repository/admin";
import * as AdminRepo from "../repository/admin";
import * as UserRepo from "../repository/user";
import { Record } from "../repository/record";
import bcrypt from "bcrypt";
import { User } from "../repository/user";

const loginValidator = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
});

const userSchema = Joi.object({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    email: Joi.string().email().required(),
    position: Joi.string().required(),
    password: Joi.string().min(8).alphanum().required(),
    confirmPassword: Joi.string().required()
});


const transactionSchema = Joi.object({
    category: Joi.string().max(50).required(),
    note: Joi.string().max(50).required(),
    amount: Joi.number().required(),
    user_id: Joi.string().required()
});

export async function validateLogin(body: Admin) {
    const { error } = loginValidator.validate(body);

    if (error) return error.message;

    const matchedUser = await AdminRepo.findByUsername(body.username);
    
    if (!matchedUser)
        return "Invalid username";

    const passwordMatched = await bcrypt.compare(body.password, matchedUser.password)

    if (!passwordMatched)
        return "Incorrect password";

    return "";
}

export async function validateUser(body: User) {
    const { error } = userSchema.validate(body);

    if (error) return error.message;
    
    const matchedUser = await UserRepo.findByEmail(body.email);
    
    if (matchedUser)
        return "Email already taken";

    if (body.password != (<any>body).confirmPassword)
        return "Password doesn't match";

    return "";
}

export function validateTransaction(record: Record) {
    const {error}  = transactionSchema.validate(record);

    if (error) return error.message;

    return null;
}
