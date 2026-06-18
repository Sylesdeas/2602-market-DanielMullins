import express from "express";

import requireUser from "#middleware/requireUser";
import {
  getAllProducts,
  getProductById,
  getUserOrdersWithProduct,
} from "#db/products";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const products = await getAllProducts();
    res.send(products);
  } catch (error) {
    next(error);
  }
});

router.get("/:id/orders", requireUser, async (req, res, next) => {
  try {
    const product = await getProductById(req.params.id);

    if (!product) {
      return res.status(404).send({ error: "Product not found" });
    }

    const orders = await getUserOrdersWithProduct(req.user.id, req.params.id);

    res.send(orders);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const product = await getProductById(req.params.id);

    if (!product) {
      return res.status(404).send({ error: "Product not found" });
    }

    res.send(product);
  } catch (error) {
    next(error);
  }
});

export default router;
