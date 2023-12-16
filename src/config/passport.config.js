import passport from "passport";
import GithubStrategy from "passport-github2";
import userModel from "../models/users.model.js";
import { config } from "../config/config.js";

const initializePassport=()=>{

    passport.use("github",
    new GithubStrategy(
        
        {
            clientID:config.github.client_id,
            clientSecret:config.github.client_secret,
            callbackURL:"http://localhost:8080/api/session/githubcallback",
        },
        async (accessToken,refreshToken,profile,done)=>{
            try {
            console.log("PROFILE INFO ******", profile);
            let user = await userModel.findOne({ email: profile._json?.email });
            if (!user) {
            let addNewUser = {
                firstName: profile._json.name,
                lastName: "",
                age: 0,
                username: profile._json?.email,
                email: profile._json?.email,
                password: "",
            };
            let newUser = await userModel.create(addNewUser);
            done(null, newUser);
            } else {
            // ya existia el usuario
            done(null, user);
            }
            } catch (error) {
                done(error)
            }
            }
    )
    );

    passport.serializeUser((user, done) => {
        done(null, user._id);
        });

    passport.deserializeUser(async (id, done) => {
    let user = await userModel.findById({ _id: id });
    done(null, user);
    });    
};

export default initializePassport;
