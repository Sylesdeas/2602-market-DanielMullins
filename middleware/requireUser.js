import jwt from "jsonwebtoken";

export default function requireUser(req, res, next) {
  const auth = req.headers.authorization;

  if (!auth) {
    return res.status(401).send({ error: "Unauthorized" });
  }

  const token = auth.startsWith("Bearer ") ? auth.slice(7) : auth;

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).send({ error: "Unauthorized" });
  }
}
