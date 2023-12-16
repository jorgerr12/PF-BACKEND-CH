import { Products } from "../dao/factory.js";
import ProductReporitory from "./products.repository.js"
import { Carts} from "../dao/factory.js"
import CartRepository from "./carts.repository.js"
import { Sessions } from "../dao/factory.js";
import SessionRepository from "./sessions.repository.js"
import { MailingRepository } from "./mailing.repository.js";





const ProductService = new ProductReporitory(new Products());
const CartService = new CartRepository(new Carts());
const SessionService = new SessionRepository(new Sessions());
const MailingService = new MailingRepository();

export {
    ProductService,
    CartService,
    SessionService,
    MailingService
}
