// Generates the extension icons as PNGs: two text lines whose first part is heavier,
// the visual idea of word emphasis. Run once with `node scripts/icons.mjs`; output is committed.
import { mkdirSync, writeFileSync } from "node:fs";
import { deflateSync } from "node:zlib";

const BG = [31, 95, 58];
const FG = [251, 250, 247];

function crc32(buf) {
  let c;
  let crc = 0xffffffff;
  for (const byte of buf) {
    c = (crc ^ byte) & 0xff;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crc = (crc >>> 8) ^ c;
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

/** Coverage of shape at (x, y) in unit coordinates: 0 none, 1 background, 2 foreground. */
function shape(x, y) {
  const r = 0.22;
  const cx = Math.min(Math.max(x, r), 1 - r);
  const cy = Math.min(Math.max(y, r), 1 - r);
  if ((x - cx) ** 2 + (y - cy) ** 2 > r * r) return 0;
  const bar = (top, h, x0, x1) => y >= top && y <= top + h && x >= x0 && x <= x1;
  // Line 1: heavy start + light rest. Line 2: same, shorter.
  if (bar(0.3, 0.14, 0.2, 0.44) || bar(0.34, 0.06, 0.44, 0.8)) return 2;
  if (bar(0.56, 0.14, 0.2, 0.38) || bar(0.6, 0.06, 0.38, 0.66)) return 2;
  return 1;
}

function png(size) {
  const ss = 4;
  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0;
    for (let x = 0; x < size; x++) {
      let bg = 0;
      let fg = 0;
      for (let sy = 0; sy < ss; sy++) {
        for (let sx = 0; sx < ss; sx++) {
          const v = shape((x + (sx + 0.5) / ss) / size, (y + (sy + 0.5) / ss) / size);
          if (v === 1) bg++;
          if (v === 2) fg++;
        }
      }
      const total = ss * ss;
      const alpha = (bg + fg) / total;
      const mix = bg + fg ? fg / (bg + fg) : 0;
      const o = y * (size * 4 + 1) + 1 + x * 4;
      for (let i = 0; i < 3; i++) raw[o + i] = Math.round(BG[i] * (1 - mix) + FG[i] * mix);
      raw[o + 3] = Math.round(alpha * 255);
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

const dir = new URL("../static/icons/", import.meta.url);
mkdirSync(dir, { recursive: true });
for (const size of [16, 32, 48, 128]) writeFileSync(new URL(`icon-${size}.png`, dir), png(size));
