import express from "express";
import { PrismaClient } from "@prisma/client";
import authMiddleware from "../middleware/auth.js";

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

router.get("/", authMiddleware, async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Página atual (padrão é 1)
  const limit = 5; // Número de dúvidas por página
  const offset = (page - 1) * limit; // Deslocamento para a consulta

  try {
    const questions = await prisma.question.findMany({
      skip: offset,
      take: limit,
      orderBy: { createdAt: "desc" }, // Ordena pela data de criação
    });

    // Contar o total de dúvidas para calcular o número total de páginas
    const totalQuestions = await prisma.question.count();

    res.json({
      questions,
      totalPages: Math.ceil(totalQuestions / limit), // Número total de páginas
      currentPage: page, // Página atual
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao carregar dúvidas." });
  }
});

export default router;
