import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

const USER = {
  username: "admin",
  password: "1234", // apenas exemplo!
};

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === USER.username && password === USER.password) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } else {
    res.status(401).json({ error: "Credenciais inválidas" });
  }
});

export default router;
