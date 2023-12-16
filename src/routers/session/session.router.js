import { Router } from "express"
import { SessionController } from "../../controllers/sessions.controller.js";
import { MailingController } from "../../controllers/mailing.controller.js";


const router = Router()

router.post("/register",SessionController.register);
router.post("/login", SessionController.login)
router.get("/logout",SessionController.logout);
router.get("/github",SessionController.github);
router.get("/githubcallback",SessionController.githubcallback);
router.post("/forget-password",MailingController.sendRecoveryPassword);
router.get("/verify-token/:token",SessionController.verifyToken);
router.post("/reset-password/:user",SessionController.resetPassword)
export { router as sessionRouter }