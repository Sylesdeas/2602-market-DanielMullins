import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { createUser, getUserByUsername } from "#db/users";

const router = express.Router();

function createToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );
}

router.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .send({ error: "Username and password are required" });
    }

    const user = await createUser({ username, password });
    const token = createToken(user);

    res.send({ token });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .send({ error: "Username and password are required" });
    }

    const user = await getUserByUsername(username);

    if (!user) {
      return res.status(401).send({ error: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).send({ error: "Invalid credentials" });
    }

    const token = createToken(user);

    res.send({ token });
  } catch (error) {
    next(error);
  }
});

export default router;
