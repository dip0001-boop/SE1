// server.js
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { galaxyRouter } from "./galaxyRoutes.js";
import { saveWorld, loadWorld } from "./saveLoad.js";
import http from "http";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/api/galaxy", galaxyRouter);

// Save / Load endpoints
app.post("/api/save", (req, res) => {
  const { name, data } = req.body;
  if (!name || !data) return res.status(400).json({ error: "name and data required" });
  try {
    saveWorld(name, data);
    res.json({ ok: true });
  } catch (err) {
    console.error("save error", err);
    res.status(500).json({ error: "save failed" });
  }
});

app.get("/api/load", (req, res) => {
  const name = String(req.query.name || "");
  if (!name) return res.status(400).json({ error: "name required" });
  try {
    const data = loadWorld(name);
    if (!data) return res.status(404).json({ error: "not found" });
    res.json({ data });
  } catch (err) {
    console.error("load error", err);
    res.status(500).json({ error: "load failed" });
  }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(__dirname));
app.get("*", (_req, res) => res.sendFile(path.join(__dirname, "index.html")));

// Start HTTP server and attempt to enable WebSocket if available
const server = http.createServer(app);

async function tryStartWebSocketServer() {
  try {
    // dynamic import so server still runs if ws is missing or fails
    const { WebSocketServer } = await import("ws");
    const wss = new WebSocketServer({ server, path: "/ws" });

    wss.on("connection", (ws) => {
      ws.on("message", (msg) => {
        try {
          const obj = JSON.parse(msg.toString());
          if (obj && obj.type === "syncSeed") {
            // broadcast to others
            wss.clients.forEach((c) => {
              if (c !== ws && c.readyState === 1) c.send(JSON.stringify(obj));
            });
          }
        } catch (e) {
          // ignore malformed messages
        }
      });
    });

    console.log("WebSocket server enabled at /ws");
  } catch (err) {
    console.warn("WebSocket server not available. Continuing without multiplayer.", err.message || err);
  }
}

server.listen(PORT, async () => {
  console.log(`Singularity Engine backend running on port ${PORT}`);
  await tryStartWebSocketServer();
});
