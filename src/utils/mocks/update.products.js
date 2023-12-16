import productModel from "../../models/products.model.js";
import { ProductService as productService } from "../../repository/index.repository.js";


const updateProduct = async()=>{
    const products = await productModel.find().lean().exec()
    const createdBy = {
        user: "jorge_9_90@hotmail.com",
        role: "ADMIN"
    };
    console.log(products)
    await Promise.all(products.map(async item => {
        const product = await productModel.findById(item._id)
        product.createdBy = createdBy
        await product.save();
    }));

}

updateProduct()