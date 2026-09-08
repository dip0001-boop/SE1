// saveLoad.js (NEW) - simple file-backed save/load for sectors and worlds
import fs from "fs";
import path from "path";

const SAVE_DIR = path.join(process.cwd(), "saves");
if (!fs.existsSync(SAVE_DIR)) fs.mkdirSync(SAVE_DIR, { recursive: true });

export function saveWorld(name, data) {
  const file = path.join(SAVE_DIR, `${name}.json`);
  fs.writeFileSync(file, JSON.stringify(data));
  return true;
}

export function loadWorld(name) {
  const file = path.join(SAVE_DIR, `${name}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf8"));
}
