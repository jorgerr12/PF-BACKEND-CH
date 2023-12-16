import { Router } from "express"
import { MailingController } from "../../controllers/mailing.controller.js";


const router = Router()

router.post("/email/send",MailingController.sendEmail);

export { router as mailingRouter }