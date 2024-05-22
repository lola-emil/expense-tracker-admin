import { Router } from "express";
import * as DashboardController from "../controllers/dashboard";
import * as UserRepo from "../../repository/user";
import * as RecordRepo from "../../repository/record";
import { validateTransaction } from "../../utils/validators";

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

router.get('/restore-record/:recordId', async (req, res) => {
    const recordId = req.params.recordId;

    await RecordRepo.restore(recordId);

    req.flash("message", "Record restored successfully")

    return res.redirect("/expense-overview/" + req.query.userId);
})

router.get("/soft-delete/:recordId", async (req, res) => {
    const recordId = req.params.recordId;

    await RecordRepo.softDelete(recordId);


    req.flash("message", "Record deleted successfully")

    return res.redirect("/expense-overview/" + req.query.userId);
});

router.get("/hard-delete/:recordId", async (req, res) => {
    const recordId = req.params.recordId;

    await RecordRepo.hardDelete(recordId);

    req.flash("message", "Record deleted forever")

    return res.redirect("/expense-overview/" + req.query.userId);
});

router.post("/add-record", async (req, res) => {
    const body = req.body;

    body.user_id = req.query.userId;

    const error = validateTransaction(body);

    console.log(error);
    if (error) {
        req.flash('error', error);
        return res.redirect('/expense-overview/' + req.query.userId);
    }

    await RecordRepo.insert(body);

    req.flash('message', 'Record added successfully');

    return res.redirect('/expense-overview/' + req.query.userId);
})

export default router;