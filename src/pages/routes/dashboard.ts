import { Router } from "express";
import * as DashboardController from "../controllers/dashboard";
import * as UserRepo from "../../repository/user";

const router = Router();

router.get("/", DashboardController.dashboardPage);
router.get("/expense-overview/:user_id", DashboardController.expenseOverview)

router.get("/add-user", DashboardController.addUserPage);
router.post("/add-user", DashboardController.addUser);


router.get('/delete-user/:userId', async (req, res) => {
    const userId = req.params.userId;

    await UserRepo.deleteUser(userId);

    req.flash('message', 'User deleted successfully');

    return res.redirect("/");
});

export default router;