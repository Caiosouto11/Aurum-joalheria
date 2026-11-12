import "dotenv/config";
import express from "express";
import cors from "cors";
import productsRoutes from "./routes/products.routes.js";
import { notFound, errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use(productsRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3333;
app.listen(PORT, (err) => {
  if (err) {
    console.error(`❌ Não foi possível iniciar na porta ${PORT}:`, err.message);
    process.exit(1);
  }
  console.log(`🚀 API rodando em http://localhost:${PORT}`);
});
