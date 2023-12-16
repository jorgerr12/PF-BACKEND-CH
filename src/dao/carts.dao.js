import cartsModel from "../models/carts.models.js";

export default class CartDao {
  constructor() {}

  async insertCarts(cartsData) {
    return cartsModel.insertMany(cartsData);
  }

  async getAllCarts() {
    return cartsModel.find({});
  }

  async getCartById(cid) {
    return cartsModel.findById(cid).lean().exec();
  }

  async createCart(cartData) {
    return cartsModel.create(cartData);
  }

  async updateCartById(cid, cartData) {
    return cartsModel.findByIdAndUpdate(cid, { products: cartData }, { new: true });
  }

  async deleteCartById(cartId) {
    return cartsModel.deleteOne({ _id: cartId });
  }
}

