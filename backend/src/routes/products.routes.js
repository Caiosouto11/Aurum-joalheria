import { Router } from "express";
import * as controller from "../controllers/products.controller.js";

const router = Router();

router.get("/products", controller.index);
router.get("/products/:slug", controller.show);
router.get("/categories", controller.categories);

export default router;
