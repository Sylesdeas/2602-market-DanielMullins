import express from "express";

import usersRouter from "#routes/users";
import productsRouter from "#routes/products";
import ordersRouter from "#routes/orders";

const app = express();

app.use(express.json());

app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/orders", ordersRouter);

app.use((req, res) => {
  res.status(404).send({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  if (err.code === "23505") {
    return res.status(400).send({ error: "Username already exists" });
  }

  console.error(err);
  res.status(500).send({ error: "Internal server error" });
});

export default app;
