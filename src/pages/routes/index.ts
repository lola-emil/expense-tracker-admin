import { Router } from "express";
import loginRoute from "./login";

const router = Router();

router.get("/", (req, res) => {
    res.render("index");
});

router.use("/login", loginRoute);

export default router;