
import { createHashValue, isValidPassword } from "../utils.js";
import userModel from "../models/users.model.js";
import passport from "passport";
import UserPasswordModel from "../models/userPassword.model.js";
import bcrypt from 'bcryptjs'
import { setLogger } from "../utils/logger.js";
import { SessionService as sessionService } from "../repository/index.repository.js";
export class SessionController {

  static async register(req, res, next) {
    try {
      const newUser = await sessionService.register(req,res)
      res.send({ status: "success", message: "usuario registrado con exito", user: newUser })   
    } catch (error) {
      console.log("🚀 ~ file: users.service.js:65 ~ sessionServiceDao ~ registerUser= ~ error:", error)
    }
  }

  static async login(req, res, next) {
    
     try {
       const logUser = await sessionService.login(req,res)

       res.send({ status: "success", message: "usuario logeado", user: logUser })  
     } catch (error) {
      console.log("🚀 ~ file: users.service.js:65 ~ sessionServiceDao ~ registerUser= ~ error:", error)
     }

  }

  static async logout(req, res) {
    if (req.session.user) {

      req.session.destroy((err) => {
        if (err) {
         setLogger.error(err.message)
        } else {
          res.clearCookie("session1");
          res.redirect("/");
        }
      });
    } else {
      res.send("no se puede desloggear si no esta logeado");
    }
  }

  static async github(req, res) {
    try {
      passport.authenticate("github", { scope: ["user:email"] })(req, res);
    } catch (error) {
      console.log("error:", error)
    }
  }

  static async githubcallback(req, res) {
    try {
      passport.authenticate("github", { failureRedirect: "/login" })(
        req,
        res,
        () => {
          console.log(
            `Using ENDPOINT of github/callback to communicate`
          );
          req.session.user = req.user;
          res.send({ status: "success", message: "usuario logeado con exito", user: req.session.user })
        }
      );
    } catch (error) {
      console.log("🚀 ~ file: users.repository.js:110 ~ sessionServiceDao ~ githubCallback= ~ error:", error)
    }
  }

  static async verifyToken(req, res) {
    const token = req.params.token
    const userPassword = await UserPasswordModel.findOne({ token })
    if (!userPassword) {
      // return res.status(404).json({ status: 'error', error: 'Token no válido / El token ha expirado' })
      return res.redirect('/forget-password');
    }
    const user = userPassword.email
    res.render('reset-password', {layout: false, user })
  }

  static async resetPassword(req,res){
    
    try {
      const email = req.params.user;
      const user = await userModel.findOne({email})
      const newPassword = req.body.newPassword;
      const passMatch = await bcrypt.compareSync(newPassword, user.password);
      if (passMatch) {
        return res.json({ status: 'error', message: 'No puedes usar la misma contraseña' });
      }
      const password = await createHashValue(newPassword);
      await userModel.findByIdAndUpdate(user._id, { password });
      res.json({ status: 'success', message: 'Se ha creado una nueva contraseña' })
    await UserPasswordModel.deleteOne({ email: req.params.user })
    } catch (error) {
      res.json({ status: 'error', message: `No se ha podido crear la nueva contraseña: ${error}` })
    }

  }
}