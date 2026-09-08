import { Router } from "express";
import { getSectorSeed } from "./storage.js";

export const galaxyRouter = Router();

galaxyRouter.get("/sector", (req, res) => {
  const sectorId = req.query.sectorId || "0,0,0";
  const seed = getSectorSeed(sectorId);
  res.json({ sectorId, seed });
});
