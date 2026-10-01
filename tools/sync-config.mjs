import fs from "node:fs";

// project.config.json is the source of truth; page.tsx embeds a serialised copy
// as `projectConfig`, so regenerate it whenever the token file changes.
const cfg = JSON.parse(fs.readFileSync("src/project.config.json", "utf8"));
const compact = JSON.stringify(cfg);

const p = "src/app/page.tsx";
let t = fs.readFileSync(p, "utf8");
t = t.replace(
  /export const projectConfig = \{.*?\};/s,
  "export const projectConfig = " + compact + ";",
);
t = t.replace(
  /cardsBackgroundColor=\{[^}]*\}/,
  'cardsBackgroundColor={"' + cfg.cardsBackgroundColor + '"}',
);
fs.writeFileSync(p, t, "utf8");
console.log("page.tsx projectConfig synced (bg " + cfg.cardsBackgroundColor + ")");