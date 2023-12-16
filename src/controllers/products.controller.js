
import ProductDto from "../dto/product.dto.js";
import { ProductService as productService } from "../repository/index.repository.js";
export class ProductosController {

    static async generateMockingProducts(req, res) {
        console.log("generando productos")
        try {
            const products = await productService.generateMockingProducts();
            return res.json({ message: `All mock products successfully generated`, products });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    static async index(req, res) {
        const products = await productService.getAll()
        res.json({
            status: "success",
            data: products,
        });
    }

    static async getById(req, res) {
        const pid = req.params.pid
        const product = await productService.getProductById(pid)
        product
            ? res.json({
                status: "success",
                data: product,
            })
            :
            res.status(400).json({
                status: "error",
                error: "no existe producto con ese pid"
            })
    }

    static async store(req, res) {
        try {
            const productInstDto = /* new ProductDto */(req.body);
            const newProduct = await this.productService.createProduct(productInstDto, res);

            return res.json({
                message: `Product created successfully`,
                product: newProduct,
            });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    static async update(req, res) {
        const pid = req.params.pid
        const pruduct = req.body;
        const foundId = pruduct.hasOwnProperty("id");
        const data = await productService.updateProduct(pid, pruduct)
        console.log(data)

        if (foundId) {
            res.status(400).send("no se puede modificar la propiedad id");
        } else {
            if (data) {
                res.json({
                    status: "succes",
                    data: data
                });
            } else {
                res.status(400).json({ status: "error", error: "producto no existe" })
            }
        }
    }

    static async delete(req, res) {
        const pid = Number(req.params.pid);
        const product = productService.getProductById(pid)

        if (!product) {
            return res.status(400).json({ status: "error", error: "producto no existe" });

        }
        try {

            const deletedProduct = await productService.deleteProduct(pid);

            res.json({ status: "success", data: deletedProduct });

        } catch (error) {

            res.status(500).json({ status: "error", error: "ocurrió un error al eliminar el producto" });

        }

    }
}