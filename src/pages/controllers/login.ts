import { Request, Response } from "express";
import { validateLogin } from "../../utils/validators";
import { getFlashMessages } from "express-flash-message";


export async function showLoginPage(req: Request, res: Response) {
    const error = req.flash('error');
    const fields = req.flash('fields');

    return res.render("login", {
        error: error[0],
        fields: fields[0] ? JSON.parse(fields[0]) : { username: "", password: "" }
    });
}

export async function login(req: Request, res: Response) {
    const body = req.body;

    const error = await validateLogin(body);

    if (error) {
        req.flash('error', error);
        req.flash('fields', JSON.stringify(body));
        return res.redirect("/login");
    }

    return res.redirect("/");
}