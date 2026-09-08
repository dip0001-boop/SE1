import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { galaxyRouter } from "./galaxyRoutes.js";
import { saveWorld, loadWorld } from "./saveLoad.js";
import http from "http";
import { WebSocketServer } from "ws";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/api/galaxy", galaxyRouter);

// Save / Load endpoints
app.post("/api/save", (req, res) => {
  const { name, data } = req.body;
  if (!name || !data) return res.status(400).json({ error: "name and data required" });
  saveWorld(name, data);
  res.json({ ok: true });
});

app.get("/api/load", (req, res) => {
  const name = String(req.query.name || "");
  if (!name) return res.status(400).json({ error: "name required" });
  const data = loadWorld(name);
  if (!data) return res.status(404).json({ error: "not found" });
  res.json({ data });
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(__dirname));
app.get("*", (_req, res) => res.sendFile(path.join(__dirname, "index.html")));

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: "/ws" });

// Simple multiplayer stub: broadcast seed sync messages
wss.on("connection", (ws) => {
  ws.on("message", (msg) => {
    // expect JSON { type: "syncSeed", sectorId, seed }
    try {
      const obj = JSON.parse(msg.toString());
      if (obj && obj.type === "syncSeed") {
        // broadcast to others
        wss.clients.forEach((c) => { if (c !== ws && c.readyState === 1) c.send(JSON.stringify(obj)); });
      }
    } catch (e) {}
  });
});

server.listen(PORT, () => console.log(`Singularity Engine backend on ${PORT}`));
