import { config} from "./config.js";
import mongoose from "mongoose";

export const connectDB = async ()=>{
    try {
        mongoose.set("strictQuery", false);
        await mongoose.connect(config.mongo.url)
        console.log("base de datos conectada")
    } catch (error) {
        console.log("error al conectar base de datos:",error.message)
    }
}