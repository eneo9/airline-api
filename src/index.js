import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import router from "./routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/api", router);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

const port = process.env.PORT || 8080;

(async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(`🚀 API running on http://localhost:${port}/api/health`);
  });
})();
