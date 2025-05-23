import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import feedbackRoutes from "./routes/feedback.js";
import authRoutes from "./routes/auth.js";
import questionsRouter from "./routes/questions.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/feedback", feedbackRoutes);
app.use("/auth", authRoutes);
app.use("/questions", questionsRouter);


app.get("/", (req, res) => res.send("API de Feedback rodando!"));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
