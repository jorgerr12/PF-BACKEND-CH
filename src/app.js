import  express  from "express"
import { productsRouter } from "./routers/products/products.routes.js"
import { cartsRouter } from "./routers/cart/cart.routes.js"


const app = express()
const port = 8080

app.use(express.json())
app.use(express.urlencoded({extended:true}))



app.listen(port, () => { //el callback es opcional y suele ser informativo
    console.log("Server running on port",port)
})

app.use("/api/products",productsRouter)
app.use("/api/carts",cartsRouter)

