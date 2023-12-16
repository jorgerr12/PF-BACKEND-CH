import { Router } from "express"
import { ProductosController } from "../../controllers/products.controller.js"

const router = Router()

router.get("/",ProductosController.index);
router.post("/",ProductosController.store);
router.get("/mockingproducts",ProductosController.generateMockingProducts);
router.put("/:pid",ProductosController.update);
router.get("/:pid",ProductosController.getById);
router.delete("/:pid", ProductosController.delete);

export { router as productsRouter }