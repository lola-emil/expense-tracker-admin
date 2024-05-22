import { Router } from "express";
import userRoute from "./users";

const router = Router();

router.get("/", (req, res) => {
    res.json({
        message: "Welcome to the API"
    })
});

router.use("/user", userRoute);

export default router;