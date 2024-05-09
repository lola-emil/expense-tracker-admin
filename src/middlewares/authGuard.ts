import { NextFunction, Request, Response } from "express";



export default function authGuard(req: Request, res: Response, next: NextFunction) {
    const admin_id = (<any>req.session).admin_id;


    if (admin_id && req.originalUrl == "/login") return res.redirect("/");
    if (admin_id && req.originalUrl != "/login") return next();
    if (!admin_id && req.originalUrl == "/login") return next();
    
    else return res.redirect("/login");

}