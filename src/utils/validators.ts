import Joi from "joi"
import { Admin } from "../repository/admin";
import * as AdminRepo from "../repository/admin";
import bcrypt from "bcrypt";

const loginValidator = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
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