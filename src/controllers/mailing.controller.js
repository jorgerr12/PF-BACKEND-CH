import { MailingService } from "../repository/index.repository.js";

export class MailingController{
   
   static  sendEmail = async (req, res) => {
        console.log("sendEmails from CONTROLLER executed");

        try {
        const emailAdress = req.body.email 

        const emails = await this.mailingService.sendEmail(emailAdress, res);
        console.log(`Email succesfully sent to ${emails}`);
        return res.send({ ok: true, message: `Email sent to ${emailAdress}` });
        } catch (error) {
        return res.status(500).json({ message: error.message });
        }
    };

    static sendRecoveryPassword = async(req,res)=>{
        try {
           const emailAdress= req.body.email;
         const result = await MailingService.sendPasswordRecovery(emailAdress,res)
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    static sendDeletedAccount = async (emailAddress)=>{
        try {
            const result = await MailingService.deletedAccount(emailAddress);
            return result
        } catch (error) {
            return ({ message: error.message });
        }
    }
}