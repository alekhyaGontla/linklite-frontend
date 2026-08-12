import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import aiRoutes from "./routes/aiRoutes.js";

// Resolve .env relative to THIS file, not the shell's cwd — "../.env" only
// worked by accident depending on where `npm run server` was invoked from.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

app.use(cors());
app.use(express.json());

// Mount AI routes
app.use("/api/ai", aiRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});