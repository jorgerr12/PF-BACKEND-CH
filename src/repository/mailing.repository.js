import nodemailer from "nodemailer"
import path from "path"
import {config} from "../config/config.js"
import { generateRandomString } from "../utils.js";
import UserPasswordModel from "../models/userPassword.model.js";
import userModel from "../models/users.model.js";



const transporter = nodemailer.createTransport({
    service: "gmail",
    user: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: config.EMAIL,
        pass: config.EMAIL_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false,
    },
});

export class MailingRepository{
    constructor(){

    }

    static sendEmail = async(emailAdress,res)=>{
        try {
            let result = await transporter.sendMail({
                FROM: config.EMAIL,
                to: emailAdress,
                subject: `We've deleted your account due to inactivity`,
                html: `
                <div>
                    <h1>KAMITEC STORE</h1>
                    <h3>Ecommerse</h3>
                    <p>we're sad to see you go, but you've been lazy lately...</p>
                </div>
                `
            });
            console.log(
                "🚀 ~ file: emails.routes.js:49 ~ EmailService ~ sendEmails ~ result:",
                result
            );
        
            return { ok: true, message: `Email succesfully sent to ${emailAdress}` };
        } catch (error) {
        console.log("🚀 ~ file: emails.repository.js:59 ~ EmailService ~ sendEmails= ~ error:", error)
        }
    }

    sendDeletedProductEmail = async (emailAdress, product, res) => {
        console.log("sendDeletedProductEmail from REPOSITORY executed");


        try {
            let result = await transporter.sendMail({
                FROM: config.EMAIL,
                to: emailAdress,
                subject: `We've deleted your product!`,
                html: `
                <div>
                  
                    <h1>Reporte</h1>
                    <h3>Ecomerse</h3>
                    <p>we/ve deleted the following product</p>
                    <h4 style="margin-top: 10px;">${product.title}</h4>
                    <p>${product.description}</p>
                    <p>${product.code}</p>
                    <p>${product.price}</p>
                    <p>${product.category}</p>
                    <p style="margin-top: 10px;">Sorry about that, no hard feelings?</p>
                </div>
                `});
            console.log(
                "🚀 ~ file: emails.routes.js:49 ~ EmailService ~ sendEmails ~ result:",
                result
            );
        
            return { ok: true, message: `Email succesfully sent to ${emailAdress}` };
        } catch (error) {
        console.log("🚀 ~ file: emails.repository.js:55 ~ EmailService ~ sendEmails= ~ error:", error)
        }
    };

        sendPasswordRecovery = async (emailAdress,res)=>{
        const email = emailAdress;
        const user = userModel.findOne({email});
        if (!user) {
            return res.status(404).json({ status: 'error', error: 'User not found' });
          }
        const token = generateRandomString(16);
        await UserPasswordModel.create({email,token});
        
        let message = {
            from: config.mailDelEcommerce,
            to: email,
            subject: 'Reset you password',
            html: `<h1>Reset you password</h1>
            <hr>Si deseas restablecer tu contraseña puedes dar click en el enlace de abajo
             <a href="http://localhost:8080/api/session/verify-token/${token}" target="_blank">REESTABLECER CONTRASEÑA</a>
            <hr>
            Saludos cordiales,<br>
            <b>The Coder e-commerce API Backend</b>`
          }
          try {
            await transporter.sendMail(message)
            res.json({ status: 'success', message: `Email enviado con exito a ${email} para restablecer la contraseña` })
          } catch (err) {
            res.status(500).json({ status: 'errorx', error: err.message })
          }
        
    }

    deletedAccount = async (emailAdress)=>{
        
        for (const email of emailAdress) {
        let message = {
            from: config.mailDelEcommerce,
            to: email,
            subject: 'Cuenta eliminada por inactividad',
            html: 'Tu cuenta ha sido eliminada por inactividad'
          }
          try {
            await transporter.sendMail(message)
           return ({ status: 'success', message: `Email enviado con exito a ${email} para restablecer la contraseña` })
          } catch (err) {
            return ({ status: 'error', error: err.message })
          }
        }
    }

    sendPursache = async(emailAdress,ticket)=>{
        try {
            let result = await transporter.sendMail({
                FROM: config.EMAIL,
                to: emailAdress,
                subject: `Su orden de compra fue realizada con exito`,
                html: `
                <div>
                    <h1>KAMITEC STORE</h1>
                    <h3>Ecommerse</h3>
                    <p>Realizo con exito su orden de compra con el numero</p>
                    <span>${ticket}</span>
                </div>
                `
            });
            console.log(
                "🚀 ~ file: emails.routes.js:49 ~ EmailService ~ sendEmails ~ result:",
                result
            );
        
            return { ok: true, message: `Email succesfully sent to ${emailAdress}` };
        } catch (error) {
        console.log("🚀 ~ file: emails.repository.js:59 ~ EmailService ~ sendEmails= ~ error:", error)
        }
    }
}