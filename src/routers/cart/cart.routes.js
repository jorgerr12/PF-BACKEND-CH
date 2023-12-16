import { Router } from "express";
import { CartController } from "../../controllers/cart.controller.js";
import {auth} from "../../middlewares/auth.middlewares.js";

const router = Router()

router.get('/:cid',auth,CartController.index)
router.post("/",auth,CartController.create)
router.post('/purchase/:cid',auth, CartController.purchase)
router.put("/:cid",auth,CartController.update)
router.post("/:cid/product/:pid",auth,CartController.updateProduct)
router.delete("/:cid/product/:pid",auth,CartController.deleteProduct)
router.delete("/:cid",auth,CartController.deleteAllProduct)

export{router as cartsRouter}
