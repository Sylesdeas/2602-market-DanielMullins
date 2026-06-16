import bcrypt from "bcrypt";
import db from "#db/client";

export async function createUser({ username, password }) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const { rows } = await db.query(
    `
    INSERT INTO users (username, password)
    VALUES ($1, $2)
    RETURNING id, username;
    `,
    [username, hashedPassword],
  );

  return rows[0];
}

export async function getUserByUsername(username) {
  const { rows } = await db.query(
    "SELECT id, username, password FROM users WHERE username = $1",
    [username],
  );
  return rows[0];
}
