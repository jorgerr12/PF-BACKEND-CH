import productModel from "../models/products.model.js";
import { EnumErrors, HttpResponse } from "../middlewares/errors.middlewares.js";
import generateProducts from "../utils/mocks/generate.products.js";
import { MailingService } from "./index.repository.js";


class ProductsServiceDao {

    constructor(dao) {
        this.dao = dao;
        this.httpResp = new HttpResponse();
    }

    generateMockingProducts = async () => {
        console.log("generateMockingProducts from REPOSITORY executed");

        try {
            let products = [];
            for (let index = 0; index < 100; index++) {
                products.push(generateProducts());
            }

            return products
        } catch (error) {
            console.log("🚀 ~ file: products.repository.js:31 ~ ProductServiceDao ~ insertProducts= ~ error:", error)
        }
    }
    getAll = async (queries) => {
        try {
            const produts = await productModel.find().lean().exec()
            return produts
        } catch (error) {
            console.log("error in get products", error)
        }
    }

    getWithPaginate = async (query, options) => {
        try {

            const result = await productModel.paginate(query, options);
            return result;
        } catch (error) {
            throw error;
        }
    }

    getProductById = async (id) => {
        try {
            const product = await productModel.findById(id).lean().exec()

            return product
        } catch (error) {
            console.log("error in get product:", error)
        }
    }

    createProduct = async (productData, res) => {
        try {
            const createdBy = {
                user: req.session.user._doc.email,
                role: req.session.user._doc.role
            };
            if (
                (!productData.title || typeof productData.title !== 'string') ||
                (!productData.description || typeof productData.description !== 'string') ||
                (!productData.code || typeof productData.code !== 'string') ||
                (!productData.category || typeof productData.category !== 'string') ||
                (!productData.price || typeof productData.price !== 'number') ||
                (!productData.stock || typeof productData.stock !== 'number') ||
                (!productData.status || typeof productData.status !== 'boolean')
            ) {
                return this.httpResp.BadRequest(
                    res,
                    `${EnumErrors.INVALID_PARAMS} - Invalid Params for Product `,
                    productData
                );
            }

            const codeCheck = await productModel.findOne({ code: productData.code });
        
            if (codeCheck) {
                return this.httpResp.BadRequest(
                    res,
                    `${EnumErrors.DATABASE_ERROR} - Product code already exist`,
                    productData.code
                );
            }
            productData.createdBy = createdBy;
            const product = await productModel.create(productData);
            return product;

        } catch (error) {
            return this.httpResp.Error(
                res,
                `Error creating product`,
                error?.message
            );
        }
    }
    updateProduct = async (id, fieldsToUpdate) => {

        try {

            const updetedProduct = await productModel.findByIdAndUpdate(id, fieldsToUpdate)
            return updetedProduct

        } catch (error) {
            console.log("error in update product", error)
        }
    }

    deleteProduct = async (id) => {
        try {
            const deletedProduct = await productModel.findByIdAndDelete(id)
            if (product.createdBy.role === "PREMIUM") {
                const emailAdress = product.createdBy.user;
          
                const emails = await MailingService.sendDeletedProductEmail(
                  emailAdress,
                  product
                );
                console.log(`Email successfully sent to ${emailAdress}`);
              }
            return deletedProduct
        } catch (error) {
            console.log("error in deleted product", error)
        }
    }

    loggerTest = async (productId) => {
        console.log("getProductById from REPOSITORY executed");

        try {
            const product = await productModel.findById({ _id: productId });
            return product;

        } catch (error) {
            console.log("🚀 ~ file: products.repository.js:67 ~ ProductServiceDao ~ loggerTest= ~ error:", error)
        }
    };


}

export default ProductsServiceDao