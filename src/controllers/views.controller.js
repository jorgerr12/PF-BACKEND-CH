import CartDao from "../dao/carts.dao.js";
import userModel from "../models/users.model.js";
import { CartService as cartService, ProductService as productService } from "../repository/index.repository.js";
import { setLogger } from "../utils/logger.js";


export class ViewsController {

  static home(req, res) {
    res.render("home", {});
  }
  static showRealtimeproducts(req, res) {
    res.render("realTimeProducts", {});
  }
  static async showProducts(req, res) {
    try {
      const { limit = 10, page = 1, stock = 0, sort = "asc" } = req.query;
      const stockValue = stock === 0 ? undefined : parseInt(stock)
      if (!["asc", "desc"].includes(sort)) {
        return res.render("products", { error: "Dato de orden no valido" })
      };
      const sortValue = sort === "asc" ? 1 : -1;
      let query = {}
      if (stockValue) {
        query = { stock: { $gte: stockValue } }
      }

      const result = await productService.getWithPaginate(query, {
        limit,
        page,
        sort: { price: sortValue },
        lean: true
      })

      const baseUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`
      const resultProducts = {
        status: "success",
        payload: result.docs,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.hasPrevPage ? `/products/?limit=${limit}&page=${result.prevPage}` : null,
        nextLink: result.hasNextPage ? `/products/?limit=${limit}&page=${result.nextPage}` : null,

      }

      res.render("products", resultProducts)
    } catch (error) {
      res.render("products", { error: error });
    }

  }

  static async showProductDetails(req, res) {
    try {
      const cid = req.params.cid
      const cart_id = req.session.user.cart
      const result = await productService.getProductById(cid)
      console.log(result)
      res.render("productDetail", { cart: cart_id, product: result },)

    } catch (error) {
      res.render("productDetail", { error: error })
    }
  }

  static async showCart(req, res) {
    try {
      const cid = req.params.cid;
      const resultCart = await cartService.getCartById(cid);
      
      const productos = resultCart.products.map(item => {
        const total = Number(item.product.price) * Number(item.quantity)
        return { ...item, total }
      });
      const total = productos.reduce((acc,item) =>acc+ Number(item.total),0);
      res.render("cart", { cid: resultCart._id, products: productos,total:total })

    } catch (error) {
      res.render("cart", { error: error })
    }
  }
  static showLogin(req, res) {
    if (req.session?.user) {
      res.send("ya esta loggeado, no se puede volver a logear");
    } else {
      res.render("login", { layout: false });
    }
  }
  static showRegister(req, res) {
    if (req.session?.user) {
      res.send("ya esta loggeado, no se puede volver a logear");
    } else {
      res.render("register", { layout: false });
    }
  }
  static showForgetPassword(req, res) {
    res.render("forget-password", { layout: false });
  }
  static async showUsers(req, res) {
    const users = await userModel.find().lean().exec();

    const filteredUsers = users.filter(user => user.role !== "admin");

    res.render('users-state', { filteredUsers });
  }
}