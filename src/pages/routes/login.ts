import { Router } from "express";
import * as LoginController from "../controllers/login";

const router = Router();

router.get("/", LoginController.showLoginPage);
router.post("/", LoginController.login);
export default router;