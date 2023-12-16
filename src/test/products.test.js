import mongoose, { mongo } from "mongoose";
import { ProductService as productService } from "../repository/index.repository.js";
import { config } from "../config/config.js";
import Assert from "assert";
import { faker } from '@faker-js/faker'

const mongoUrl = config.mongo.urlTest

mongoose.connect(mongoUrl);

const assert = Assert.strict;

describe('Testing Product DAO', () => {
    before(async function () {
        this.productDao = new productService()
    })
    beforeEach(async function () {
        try {
            await mongoose.connection.collections.products.drop()
        } catch (err) {}
    })
    it('El get debe devolver los productos en un arreglo', async function () {
        const result = await this.productDao.getAll()
        assert.strictEqual(Array.isArray(result), true)
    })
    it('El DAO debe poder crear productos', async function () {
        const result = await this.productDao.create({
            title: faker.commerce.productName(),
            description: faker.lorem.sentence(),
            code: faker.string.nanoid(10),
            status: true,
            price: parseFloat(faker.commerce.price()),
            stock: parseInt(faker.number.int({ min: 20, max: 100 })),
            category: faker.commerce.department(),
            thumbnail: [faker.image.url()],
        })
        assert.ok(result._id)
    })
})
