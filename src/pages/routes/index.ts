import { Router } from "express";
import authGuard from "../../middlewares/authGuard";

import dashboardRoute from "./dashboard";
import loginRoute from "./login";

const router = Router();

router.use("/", authGuard, dashboardRoute);

router.use("/login", authGuard, loginRoute);

export default router;