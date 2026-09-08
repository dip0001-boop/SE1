import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { galaxyRouter } from "./galaxyRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/galaxy", galaxyRouter);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(__dirname));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log("Singularity Engine 1 backend running on port " + PORT);
});
