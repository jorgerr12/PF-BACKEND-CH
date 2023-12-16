import productModel from "../models/products.model.js"
import Ticket from "../models/ticket.model.js"
import userModel from "../models/users.model.js"
import { ProductService as productService, CartService as cartService, MailingService } from "../repository/index.repository.js"



export class CartController {

    static async index(req, res) {
        try {
            const cid = req.params.cid
            const data = await cartService.getCartById(cid)
            data
                ? res.json({ status: "success", data: data })
                : res.json({ status: "error", error: "cid incorrecto" })
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }

    }

    static async create(req, res) {
        try {
            const { products } = req.body
            const data = {
                products: [...products],

            }
            res.json({
                status: "success",
                data: await cartService.createCart(data)
            })
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }

    }

    static async update(req, res) {
        try {
            const cid = req.params.cid
            const { products } = req.body
            const data = await cartService.updateCart(cid, products)
            data
                ? res.json({
                    status: "success",
                    data: data
                })
                : res.json({ status: "error", error: "error al registrar producto" })
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }

    }

    static async updateProduct(req, res) {
        try {
            const cid = req.params.cid
            const pid = req.params.pid

            const result = await cartService.updateProductFromCart(req,cid, pid)
            result
                ?
                res.json({
                    status: "success",
                    message: "Producto se agrego correctamente al carrito",
                    result: result
                })
                : res.json({ status: "error", error: "error al registrar producto" })
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }

    }
    static async deleteProduct(req, res) {
        try {
            const cid = req.params.cid
            const pid = req.params.pid
            const result = await cartService.deleteProduct(cid, pid)
            result
                ?
                res.json({
                    status: "success",
                    result: result,
                    message: "se elimino producto correctamente"
                })
                : res.json({ status: "error", error: "error al intentar eliminar producto" })
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }

    }

    static async deleteAllProduct(req, res) {
        try {
            const cid = req.params.cid
            const result = await cartService.deleteAllProductsCart(cid)
            result
                ?
                res.json({
                    status: "success",
                    result: result
                })
                : res.json({ status: "error", error: "error al registrar producto" })
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }

    }

    static async purchase(req, res) {
        try {
            const cid = req.params.cid
            const emailClient = req.session.user.email
            const cart = await cartService.getCartById(cid)
            if (!cart) {
                res.status(404).json({ error: 'Carrito no encontrado' })
            }
            let totalAmount = 0
            const pursacheProducts = []
            const unprocessedProducts = cart.products.filter(item => {
                const product = item.product;

                if (product.stock >= item.quantity) {
                    product.stock -= item.quantity; // Actualizar stock del producto
                    totalAmount += product.price * item.quantity; // Actualizar monto total
                    pursacheProducts.push(item); // Agregar a los productos comprados
                    return false; // Producto comprado y procesado
                }

                return true; // Producto no procesado
            });
            if (pursacheProducts.length === 0) {
                res.status(400).json({ error: 'No se pudo procesar ninguna compra' });
                return;
            }

            // Actualizar los stocks de los productos comprados
            await Promise.all(pursacheProducts.map(async item => {
                const product = await productModel.findById(item.product._id)
                product.stock -= item.quantity;
                await product.save();
            }));

            // Crear un ticket con los datos de la compra
            const ticketData = {
                amount: totalAmount,
                purchaser: req.session.user.email,
            };
            const newTicket = await Ticket.create(ticketData);
            const user = await userModel.findById(req.session.user._id).populate('cart').exec();

            if (user.cart) {
                user.cart.products = unprocessedProducts;
                await user.cart.save();
            }
            // se envia el correo de orden exitosa
            if (newTicket) {
                await MailingService.sendPursache(emailClient, newTicket.code)
            }


            res.status(200).json({
                status:"success",
                pursacheProducts,
                unprocessedProducts,
                ticket: newTicket
            });

        } catch (error) {
            return res.status(500).json({ message: error.message });
        }


    }
}