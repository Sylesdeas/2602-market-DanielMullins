import db from "#db/client";

export async function getAllProducts() {
  const { rows } = await db.query(`
    SELECT *
    FROM products
    ORDER BY id;
  `);

  return rows;
}

export async function getProductById(id) {
  const { rows } = await db.query(
    `
    SELECT *
    FROM products
    WHERE id = $1;
    `,
    [id],
  );

  return rows[0];
}

export async function getUserOrdersWithProduct(userId, productId) {
  const { rows } = await db.query(
    `
    SELECT orders.*
    FROM orders
    JOIN orders_products ON orders.id = orders_products.order_id
    WHERE orders.user_id = $1
      AND orders_products.product_id = $2
    ORDER BY orders.id;
    `,
    [userId, productId],
  );

  return rows;
}
