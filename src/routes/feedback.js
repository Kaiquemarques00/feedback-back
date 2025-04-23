import express from "express";
import { PrismaClient } from "@prisma/client";
import authMiddleware from "../middleware/auth.js";

const prisma = new PrismaClient();
const router = express.Router();

// Enviar feedback
router.post("/", async (req, res) => {
  const { name, email, note, comment } = req.body;
  if (!note || !comment) return res.status(400).json({ error: "Nota e comentário são obrigatórios" });

  const feedback = await prisma.feedback.create({
    data: { name, email, note, comment },
  });

  res.status(201).json(feedback);
});

// Listar feedbacks com paginação (somente admin)
router.get("/", authMiddleware, async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Página atual (padrão é 1)
  const limit = 5; // Número de feedbacks por página
  const offset = (page - 1) * limit; // Deslocamento para a consulta

  try {
    const feedbacks = await prisma.feedback.findMany({
      skip: offset,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    // Contar o total de feedbacks para calcular o número total de páginas
    const totalFeedbacks = await prisma.feedback.count();

    res.json({
      feedbacks,
      totalPages: Math.ceil(totalFeedbacks / limit), // Número total de páginas
      currentPage: page, // Página atual
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao carregar feedbacks." });
  }
});

// Média das notas
router.get("/average", async (req, res) => {
  const result = await prisma.feedback.aggregate({
    _avg: { note: true },
  });

  res.json({ average: result._avg.note });
});

export default router;
