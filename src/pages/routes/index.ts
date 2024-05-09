import { Router } from "express";
import loginRoute from "./login";
import authGuard from "../../middlewares/authGuard";

const router = Router();

router.get("/", authGuard, (req, res) => {
    res.render("index");
});

router.use("/login", authGuard, loginRoute);

export default router;