import mongoose from "mongoose";
import { config } from "../config/config.js";
import  ProductsServiceDao  from "../repository/products.repository.js";
import CartsServiceDao from "../repository/carts.repository.js";
import SessionServiceDao from "../repository/sessions.repository.js";
const MONGO_URL = config.mongo.url;

class Products {
    constructor(){
        let products;
    }
}
class Carts {
    constructor(){
        let carts
    }
}

class Sessions {
    constructor (){
        let sessions
    }
}







(async () => {
    switch (config.persistence) {
      case "MONGO":
        console.log(`Persistence ${config.persistence}`);
        try {
          const connection = await mongoose.connect(MONGO_URL);
          console.log("Connected to MongoDB");
          Products = ProductsServiceDao;
          Carts = CartsServiceDao;
          Sessions = SessionServiceDao;
        } catch (err) {
          console.error("Error connecting to MongoDB:", err);
        }
        break;
  
      default:
        console.log(`PERSISTENCE ${config.persistence}`);
        try {
          console.log("Connected to fs file system");
          Products = ProductsServiceDaoMemory;
          Carts = CartsServiceDaoMemory;
          Sessions = SessionServiceDaoMemory;
        } catch (err) {
          console.error("Error importing ProductServiceDaoMemory:", err);
        }
        break;
    }
  })();

  export {
        Products,
        Carts,
        Sessions
  }