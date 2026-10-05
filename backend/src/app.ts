import express from "express";
import cors from "cors";
import leadRoutes from "./routes/leadRoutes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    name: "Leads Tracker API",
    health: "/api/health",
    leads: "/api/leads",
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/leads", leadRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
