import { Router } from "express";
import { getSectorSeed } from "./storage.js";

export const galaxyRouter = Router();

// GET /api/galaxy/sector?sectorId=0,0,0
galaxyRouter.get("/sector", (req, res) => {
  const sectorId = String(req.query.sectorId || "0,0,0");
  const seed = getSectorSeed(sectorId);
  res.json({ sectorId, seed });
});
