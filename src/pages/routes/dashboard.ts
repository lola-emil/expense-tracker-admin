import { Router } from "express";
import * as DashboardController from "../controllers/dashboard";

const router = Router();

router.get("/", DashboardController.dashboardPage);

export default router;