// routes/questions.js
import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, question } = req.body;
  if (!question) return res.status(400).json({ error: "Dúvida é obrigatória." });

  const saved = await prisma.question.create({
    data: { name, email, question },
  });

  res.status(201).json(saved);
});

export default router;
