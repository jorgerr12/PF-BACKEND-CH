import { Router } from "express";
import { UserController } from "../../controllers/users.controller.js";
import { isAdmin } from "../../middlewares/auth.middlewares.js";



const router = Router();
router.get('/', isAdmin, UserController.getUsers);
router.put('/premium/:uid', isAdmin, UserController.changeRole);
router.post('/:uid/documents', UserController.uploadDocuments);
router.delete('/inactive', isAdmin, UserController.deleteInactiveUsers);
router.delete('/:uid', isAdmin, UserController.deleteUsers);

export { router as usersRouter }