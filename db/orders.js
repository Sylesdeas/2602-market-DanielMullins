import db from "#db/client";

export async function createOrder({ date, note, userId }) {
  const { rows } = await db.query(
    `
      INSERT INTO orders (date, note, user_id) VALUES ($1, $2, $3) RETURNING *;
    `,
    [date, note || null, userId],
  );
  return rows[0];
}

export async function getOrdersByUserId(userId) {
  const { rows } = await db.query(
    `
      SELECT * FROM orders WHERE user_id = $1 ORDER BY id;
    `,
    [userId],
  );
  return rows;
}

export async function getOrderById(id) {
  const { rows } = await db.query(
    `
      SELECT * FROM orders WHERE id = $1;
    `,
    [id],
  );
  return rows[0];
}

export async function addProductToOrder({ orderId, productId, quantity }) {
  const { rows } = await db.query(
    `
    INSERT INTO orders_products (order_id, product_id, quantity)
    VALUES ($1, $2, $3)
    ON CONFLICT (order_id, product_id)
    DO UPDATE SET quantity = orders_products.quantity + EXCLUDED.quantity
    RETURNING *;
    `,
    [orderId, productId, quantity],
  );

  return rows[0];
}

export async function getProductsByOrderId(orderId) {
  const { rows } = await db.query(
    `
    SELECT products.*, orders_products.quantity
    FROM products
    JOIN orders_products
      ON products.id = orders_products.product_id
    WHERE orders_products.order_id = $1
    ORDER BY products.id;
    `,
    [orderId],
  );

  return rows;
}
