import { Router } from "express";
/* import { ProductManager } from "../dao/manager/productManager.js";
import { CartManager } from "../dao/manager/cartManager.js"; */
import {auth,isAdmin} from "../middlewares/auth.middlewares.js";
import { ViewsController } from "../controllers/views.controller.js";

const router = Router();
/* const productService = new ProductManager()
const cartService = new CartManager() */


// rutas protegidas
router.get("/realtimeproducts",auth,ViewsController.showRealtimeproducts);
router.get("/",auth, ViewsController.home);
router.get("/products",auth, ViewsController.showProducts);
router.get("/products/:cid",auth, ViewsController.showProductDetails);
router.get("/cart/:cid",auth, ViewsController.showCart)
router.get('/users', isAdmin, ViewsController.showUsers)
// rutas publicas
router.get("/login",ViewsController.showLogin)
router.get("/register",ViewsController.showRegister)
router.get("/forget-password",ViewsController.showForgetPassword)
export { router as viewsRouter }