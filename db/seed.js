import db from "#db/client";
import { createUser } from "#db/users";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  await db.query("DELETE FROM orders_products;");
  await db.query("DELETE FROM orders;");
  await db.query("DELETE FROM products;");
  await db.query("DELETE FROM users;");

  await db.query("ALTER SEQUENCE users_id_seq RESTART WITH 1;");
  await db.query("ALTER SEQUENCE products_id_seq RESTART WITH 1;");
  await db.query("ALTER SEQUENCE orders_id_seq RESTART WITH 1;");

  const user = await createUser({
    username: "demo",
    password: "password123",
  });

  const { rows: products } = await db.query(`
    INSERT INTO products (title, description, price)
    VALUES
      ('Apples', 'Fresh red apples', 1.99),
      ('Bananas', 'Organic bananas', 0.99),
      ('Bread', 'Whole grain bread', 3.49),
      ('Milk', 'One gallon of milk', 4.25),
      ('Eggs', 'Dozen eggs', 3.99),
      ('Cheese', 'Cheddar cheese block', 5.49),
      ('Chicken', 'Boneless chicken breast', 9.99),
      ('Rice', 'Long grain white rice', 2.99),
      ('Coffee', 'Ground coffee beans', 8.99),
      ('Pasta', 'Italian pasta', 1.79)
    RETURNING *;
  `);

  const { rows: orders } = await db.query(
    `
    INSERT INTO orders (date, note, user_id)
    VALUES ($1, $2, $3)
    RETURNING *;
    `,
    ["2026-06-15", "Demo grocery order", user.id],
  );

  const order = orders[0];

  await db.query(
    `
    INSERT INTO orders_products (order_id, product_id, quantity)
    VALUES
      ($1, $2, 2),
      ($1, $3, 6),
      ($1, $4, 1),
      ($1, $5, 1),
      ($1, $6, 3);
    `,
    [
      order.id,
      products[0].id,
      products[1].id,
      products[2].id,
      products[3].id,
      products[4].id,
    ],
  );

  console.log("🌱 Database seeded.");
}

await db.end();
