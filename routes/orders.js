import express from "express";

import requireUser from "#middleware/requireUser";
import { getProductById } from "#db/products";
import {
  createOrder,
  getOrdersByUserId,
  getOrderById,
  addProductToOrder,
  getProductsByOrderId,
} from "#db/orders";

const router = express.Router();

router.use(requireUser);

function canAccessOrder(order, userId) {
  return order.user_id === userId;
}

router.post("/", async (req, res, next) => {
  try {
    const { date, note } = req.body;

    if (!date) {
      return res.status(400).send({ error: "Date is required" });
    }

    const order = await createOrder({
      date,
      note,
      userId: req.user.id,
    });

    res.status(201).send(order);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const orders = await getOrdersByUserId(req.user.id);
    res.send(orders);
  } catch (error) {
    next(error);
  }
});

router.post("/:id/products", async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    const order = await getOrderById(req.params.id);

    if (!order) {
      return res.status(404).send({ error: "Order not found" });
    }

    if (!canAccessOrder(order, req.user.id)) {
      return res.status(403).send({ error: "Forbidden" });
    }

    if (!productId || !quantity) {
      return res.status(400).send({
        error: "Product ID and quantity required",
      });
    }

    const product = await getProductById(productId);

    if (!product) {
      return res.status(400).send({ error: "Product does not exist" });
    }

    const orderProduct = await addProductToOrder({
      orderId: req.params.id,
      productId,
      quantity,
    });

    res.status(201).send(orderProduct);
  } catch (error) {
    next(error);
  }
});

router.get("/:id/products", async (req, res, next) => {
  try {
    const order = await getOrderById(req.params.id);

    if (!order) {
      return res.status(404).send({ error: "Order not found" });
    }

    if (order.user_id !== req.user.id) {
      return res.status(403).send({ error: "Forbidden" });
    }

    const products = await getProductsByOrderId(req.params.id);
    res.send(products);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const order = await getOrderById(req.params.id);

    if (!order) {
      return res.status(404).send({ error: "Order not found" });
    }

    if (!canAccessOrder(order, req.user.id)) {
      return res.status(403).send({ error: "Forbidden" });
    }

    res.send(order);
  } catch (error) {
    next(error);
  }
});

export default router;
