import { createHashValue, isValidPassword } from "../utils.js";
import userModel from "../models/users.model.js";
import passport from "passport";
import { CartService } from "./index.repository.js";



class SessionServiceDao {
  constructor(dao, CartService) {
    this.dao = dao,
      this.cartService = CartService
  }

 register = async(req, res, next) =>{
    if (req.session.user) {
      res.send("ya se encuentra logeado")
    }
    try {
      if (req.body.email && req.body.firstName && req.body.password) {
        const firstName = req.body.firstName ?? req.params.firstName ?? req.firstName;
        const lastName = req.body.lastName ?? req.params.lastName;
        const age = req.body.age ?? req.params.age;
        const username = req.body.userName ?? req.params.username;
        const email = req.body.email ?? req.params.email;
        const role = req.body.role || "USER";
        const passHashed = await createHashValue(req.body.password)

        const findUserEmail = await userModel.findOne({ email:email })
        if (findUserEmail) {
          return res.status(409).json({ message: "username and/or email already exist" });
      }

      let newUserData;
      
        let cartData = {};
        const newCart = await CartService.createCart(cartData);

        newUserData = {
            firstName,
            lastName,
            age,
            username,
            email,
            password: passHashed,
            cart: newCart._id,
            role
        };
 
        const newUser = await userModel.create(newUserData);
      
        await newUser.save()
        return newUser
      }
      else {
        res.send({ status: "error", message: "complete los datos necesarios" })
      }

    } catch (error) {
      console.log("🚀 ~ file: users.service.js:65 ~ sessionServiceDao ~ registerUser= ~ error:", error)
    }

  }

  login =  async(req, res, next) =>{
    if (req.session.user) {
      res.send("ya se encuentra logeado")
    }
    if (req.body.email && req.body.password) {
      const findEmail = await userModel.findOne({ email: req.body.email });

      if (!findEmail) {
        res.send({ status: "error", message: "Email no registrado" })
      }

      const isValidPass = await isValidPassword(req.body.password, findEmail.password)

      if (!isValidPass) {
        res.send({ status: "error", message: "Contraseña incorrecta" })
      }
      findEmail.last_connection = new Date();
      await findEmail.save();
      
      req.session.user =findEmail
      const logUser = {...findEmail}
      return logUser
    }
    else {
      res.send({ status: "error", message: "complete los datos necesarios" })
    }

  }

   logout = async(req, res)=> {
    if (req.session.user) {
      req.session.destroy((err) => {
        if (err) {
          console.log(err);
        } else {
          res.clearCookie("session1");
          res.redirect("/");
        }
      });
    } else {
      res.send("no se puede desloggear si no esta logeado");
    }
  }

   github= async(req, res)=> {
    try {
      passport.authenticate("github", { scope: ["user:email"] })(req, res);
    } catch (error) {
      console.log("error:", error)
    }
  }

   githubcallback = async(req, res)=> {
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
}

export default SessionServiceDao