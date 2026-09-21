// Rodada de confirmação: recaptura todas as superfícies após os fixes.
// Uso: node scripts/screenshot-confirm.mjs  (dev na porta 3141)
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

const BASE = process.env.BASE_URL ?? "http://localhost:3141";
const OUT = fileURLToPath(new URL("../.impeccable/review/", import.meta.url));
mkdirSync(OUT, { recursive: true });

const MOBILE = { width: 390, height: 844 };

async function shot(page, name) {
  await page.waitForTimeout(1600);
  await page.screenshot({ path: `${OUT}${name}.png` });
  console.log(`✓ ${name}.png  (${page.url()})`);
}

const browser = await chromium.launch();
try {
  const mobile = await browser.newPage({ viewport: MOBILE });

  await mobile.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await shot(mobile, "home-mobile");

  // Segundo card do feed (capa tipográfica) via scroll do container snap
  await mobile.evaluate(() => {
    const el = document.querySelector(".snap-mandatory");
    if (el) el.scrollTo({ top: el.clientHeight, behavior: "instant" });
  });
  await shot(mobile, "home-mobile-card2");

  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await desktop.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await shot(desktop, "home-desktop");

  await mobile.goto(`${BASE}/serie/pastor-everaldo-dias`, { waitUntil: "networkidle" });
  await shot(mobile, "serie-mobile");

  await mobile.goto(`${BASE}/serie/getulio-vargas`, { waitUntil: "networkidle" });
  await shot(mobile, "serie-tipografica-mobile");

  await mobile.goto(`${BASE}/assistir/pastor-everaldo-dias/1?shot=player`, { waitUntil: "load" });
  await shot(mobile, "assistir-mobile");

  await mobile.goto(`${BASE}/assistir/pastor-everaldo-dias/3?shot=paywall`, { waitUntil: "load" });
  await shot(mobile, "paywall-mobile");

  await mobile.goto(`${BASE}/login`, { waitUntil: "networkidle" });
  await shot(mobile, "login-mobile");

  await mobile.goto(`${BASE}/assinar`, { waitUntil: "networkidle" });
  await shot(mobile, "assinar-mobile");
} finally {
  await browser.close();
}
