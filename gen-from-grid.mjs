/* Asset generator: green flame sampled from the shape reference, animated in
   the style of gambar.gif (smooth burn: silhouette swaying at different
   heights + brightness ripples, ~14 frames, not stepped sprite swaps).
   Reads sampled-grid.json. Output: public/media/flame-animated.png (APNG). */
import zlib from "node:zlib";
import fs from "node:fs";

const { grid } = JSON.parse(fs.readFileSync("sampled-grid.json", "utf8"));
const ROWS = grid.length, COLS = grid[0].length;
console.log("grid:", COLS + "x" + ROWS);

const OUTER = [126, 217, 87];
const HOT = [194, 247, 146];
const CORE = [43, 74, 28];

const FRAMES = 14, CELL = 12, TOP_PAD = 3;
const W = COLS * CELL, H = (ROWS + TOP_PAD) * CELL;

const cellAt = (gx, gy) => {
  if (gx < 0 || gx >= COLS || gy < 0 || gy >= ROWS) return -1;
  const ch = grid[gy][gx];
  return ch === "." ? -1 : Number(ch);
};
const shade = (c, f) => c.map((v) => Math.max(0, Math.min(255, Math.round(v * f))));

/* Skull layer: every dark-core cell. Distance from it drives the fire's
   motion field — touching the skull means holding still, so the interface
   never opens a gap while the outside dances. */
const isSkull = (gx, gy) => cellAt(gx, gy) === 2;
const distToSkull = [];
for (let gy = 0; gy < ROWS; gy++) {
  distToSkull.push([]);
  for (let gx = 0; gx < COLS; gx++) {
    if (isSkull(gx, gy)) { distToSkull[gy].push(0); continue; }
    let best = 99;
    for (let yy = 0; yy < ROWS; yy++)
      for (let xx = 0; xx < COLS; xx++)
        if (isSkull(xx, yy)) {
          const d = Math.max(Math.abs(xx - gx), Math.abs(yy - gy));
          if (d < best) best = d;
        }
    distToSkull[gy].push(best);
  }
}

function renderFrame(f) {
  const phase = (f / FRAMES) * Math.PI * 2;
  const px = Buffer.alloc(W * H * 4, 0);
  const draw = (gx, gy, rgb, a = 255) => {
    const X0 = gx * CELL, Y0 = (gy + TOP_PAD) * CELL;
    for (let py = 0; py < CELL; py++)
      for (let xx = 0; xx < CELL; xx++) {
        const X = X0 + xx, Y = Y0 + py;
        if (X < 0 || X >= W || Y < 0 || Y >= H) continue;
        const o = (Y * W + X) * 4;
        px[o] = rgb[0]; px[o + 1] = rgb[1]; px[o + 2] = rgb[2]; px[o + 3] = a;
      }
  };
  for (let gy = 0; gy < ROWS; gy++) {
    const lift = (ROWS - 1 - gy) / ROWS; // 0 at base, 1 at crown
    const glow = 0.88 + 0.24 * (0.5 + 0.5 * Math.sin(phase * 2.2 - gy * 0.5));
    for (let gx = 0; gx < COLS; gx++) {
      const u = cellAt(gx, gy); // unshifted identity of this pixel
      if (u === 2) {
        // SKULL LAYER — drawn frozen, every frame identical. No warp, no
        // flicker. It is composited over the fire, so the fire can move
        // freely behind it without ever tearing the face.
        draw(gx, gy, CORE);
        continue;
      }
      if (u < 0) {
        // empty in the base shape: only fill if the fire reaches here
        const prox = Math.min(1, distToSkull[gy][gx] / 3);
        const dx = Math.round(Math.sin(phase * 1.4 + gy * 0.35) * 1.3 * lift * prox);
        const dy = Math.round(Math.sin(phase * 2 - gy * 0.5) * 1.5 * lift * prox);
        const s = cellAt(gx - dx, gy - dy);
        if (s < 0 || s === 2) continue; // skull never bleeds outward
        const base = s === 0 ? OUTER : HOT;
        draw(gx, gy, shade(base, glow));
        continue;
      }
      // FIRE LAYER — warped sample with a sealed interface: if the warp
      // pulls an empty cell over a filled one, fall back to the unshifted
      // cell, so the body can never develop holes. Skull cells are never
      // sampled outward, so the face keeps its exact edge.
      const prox = Math.min(1, distToSkull[gy][gx] / 3);
      const dx = Math.round(Math.sin(phase * 1.4 + gy * 0.35) * 1.3 * lift * prox);
      const dy = Math.round(Math.sin(phase * 2 - gy * 0.5) * 1.5 * lift * prox);
      let s = cellAt(gx - dx, gy - dy);
      if (s < 0) s = u;
      if (s === 2) s = u === 2 ? 2 : u; // never paint skull color outside skull
      const base = s === 0 ? OUTER : s === 1 ? HOT : CORE;
      draw(gx, gy, shade(base, glow));
    }
  }
  // rising sparks above the crown, cycling
  for (let e = 0; e < 3; e++) {
    const p = (f * 1.0 + e * 4.67) % FRAMES;
    const t = p / FRAMES; // 0..1 over one loop
    const sy = 2.2 - t * 3.4; // canvas rows above grid top
    const sx = 8 + Math.sin(e * 2.1 + f * 0.4) * 1.6 + t * 1.2;
    const a = Math.round(255 * Math.max(0, 1 - t * 1.15));
    if (a > 12) draw(sx, sy - TOP_PAD, shade(HOT, 0.85), a);
  }
  return px;
}

/* ---- minimal APNG writer ---- */
const crcTable = new Int32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  crcTable[n] = c;
}
const crc = (b) => {
  let c = 0xffffffff;
  for (let i = 0; i < b.length; i++) c = crcTable[(c ^ b[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const chunk = (type, data) => {
  const t = Buffer.from(type);
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const cr = Buffer.alloc(4); cr.writeUInt32BE(crc(Buffer.concat([t, data])));
  return Buffer.concat([len, t, data, cr]);
};
const scan = (px) => {
  const rows = [];
  for (let y = 0; y < H; y++) {
    rows.push(0);
    for (let x = 0; x < W; x++) {
      const o = (y * W + x) * 4;
      rows.push(px[o], px[o + 1], px[o + 2], px[o + 3]);
    }
  }
  return zlib.deflateSync(Buffer.from(rows));
};

const SIG = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8; ihdr[9] = 6;
const actl = Buffer.alloc(8);
actl.writeUInt32BE(FRAMES, 0); actl.writeUInt32BE(0, 4);

const parts = [SIG, chunk("IHDR", ihdr), chunk("acTL", actl)];
let seq = 0;
for (let f = 0; f < FRAMES; f++) {
  const fctl = Buffer.alloc(26);
  fctl.writeUInt32BE(seq++, 0);
  fctl.writeUInt32BE(W, 4); fctl.writeUInt32BE(H, 8);
  fctl.writeUInt32BE(0, 12); fctl.writeUInt32BE(0, 16);
  fctl.writeUInt16BE(8, 20); fctl.writeUInt16BE(100, 22);
  fctl[24] = 0; fctl[25] = 0;
  parts.push(chunk("fcTL", fctl));
  const comp = scan(renderFrame(f));
  if (f === 0) parts.push(chunk("IDAT", comp));
  else {
    const s = Buffer.alloc(4); s.writeUInt32BE(seq++);
    parts.push(chunk("fdAT", Buffer.concat([s, comp])));
  }
}
parts.push(chunk("IEND", Buffer.alloc(0)));
const out = Buffer.concat(parts);
fs.writeFileSync("public/media/flame-animated.png", out);
console.log("wrote flame-animated.png", (out.length / 1024).toFixed(0), "KB,", W + "x" + H + ",", FRAMES, "frames");
