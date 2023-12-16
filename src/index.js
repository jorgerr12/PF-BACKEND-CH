import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import session from "express-session"
import { __dirname } from "./utils.js"
import hanblebars from "express-handlebars"
import { config } from "./config/config.js"
import { viewsRouter } from "./routers/views.routes.js"
import { connectDB } from "./config/dbConnection.js"
import { productsRouter } from "./routers/products/products.routes.js"
import { cartsRouter } from "./routers/cart/cart.routes.js"
import { sessionRouter } from "./routers/session/session.router.js"
import { mailingRouter } from "./routers/mailing/mailing.routes.js"
import { usersRouter } from "./routers/users/users.routes.js"
import MongoStore from "connect-mongo"
import initializePassport from "./config/passport.config.js"
import passport from "passport"
import { setLogger } from "./utils/logger.js"
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";


const NODE_ENV = process.env.NODE_ENV || 'development'
dotenv.config({
  path: `.env.${NODE_ENV}`
})


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: config.mongo.url,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 60,
    }),
    secret: "s3cr3ts3ss10ns",
    resave: false,
    saveUninitialized: false,
  })
);

initializePassport();
app.use(passport.initialize());
app.use(setLogger)
app.engine("handlebars", hanblebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

const httpServer = app.listen(config.server.port, () => {
  console.log("server running in port", config.server.port);
});
const swaggerOptions = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'Documentación de la API del Ecommerce',
      description: 'Proyecto de BackEnd CoderHouse',
      contact: {
        name: 'Jorge Renteria',
    },
    }
  },
  apis: [`${__dirname}/docs/**/*.yml`]
};
const specs = swaggerJSDoc(swaggerOptions)
app.use(`/docs`, swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

connectDB();
app.use(viewsRouter);
app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter);
app.use("/api/session", sessionRouter)
app.use("/api/mailing", mailingRouter)
app.use("/api/users", usersRouter)