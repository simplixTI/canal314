// Captura screenshots das superfícies para revisão (.impeccable/review/).
// Uso: node scripts/screenshot.mjs  (requer `npm run dev` rodando na porta 3141)
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

const BASE = process.env.BASE_URL ?? "http://localhost:3141";
const OUT = fileURLToPath(new URL("../.impeccable/review/", import.meta.url));
mkdirSync(OUT, { recursive: true });

const MOBILE = { width: 390, height: 844 };
const DESKTOP = { width: 1440, height: 900 };

async function shot(page, name) {
  await page.waitForTimeout(1600); // fontes, imagens e animações de entrada
  await page.screenshot({ path: `${OUT}${name}.png` });
  console.log(`✓ ${name}.png  (${page.url()})`);
}

const browser = await chromium.launch();
try {
  // Home — mobile + desktop
  const mobile = await browser.newPage({ viewport: MOBILE });
  await mobile.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await shot(mobile, "home-mobile");

  const desktop = await browser.newPage({ viewport: DESKTOP });
  await desktop.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await shot(desktop, "home-desktop");

  // Série carro-chefe (mobile)
  await mobile.goto(`${BASE}/serie/pastor-everaldo-dias`, { waitUntil: "networkidle" });
  await shot(mobile, "serie-mobile");

  // Tipográfica (mobile) — para revisar a capa autoral
  await mobile.goto(`${BASE}/serie/getulio-vargas`, { waitUntil: "networkidle" });
  await shot(mobile, "serie-tipografica-mobile");

  // Player (mobile): anônimo deve redirecionar para /login — tenta criar
  // conta de teste para capturar o player real com trial ativo
  await mobile.goto(`${BASE}/assistir/pastor-everaldo-dias/1`, { waitUntil: "networkidle" });
  if (mobile.url().includes("/login")) {
    const testEmail = `review+${Date.now()}@canal314.app`;
    await mobile.getByRole("button", { name: /cadastre-se grátis/i }).click();
    await mobile.locator("#email").fill(testEmail);
    await mobile.locator("#password").fill("review3141");
    await mobile.getByRole("button", { name: /começar teste grátis/i }).click();
    await mobile.waitForTimeout(3500);
    await mobile.goto(`${BASE}/assistir/pastor-everaldo-dias/1`, { waitUntil: "networkidle" });
  }
  await shot(mobile, "assistir-mobile");

  // Login (mobile)
  const anon = await browser.newPage({ viewport: MOBILE });
  await anon.goto(`${BASE}/login`, { waitUntil: "networkidle" });
  await shot(anon, "login-mobile");

  // Assinar (mobile) — usa a sessão da página mobile se houver; senão mostra redirect
  await mobile.goto(`${BASE}/assinar`, { waitUntil: "networkidle" });
  await shot(mobile, "assinar-mobile");
} finally {
  await browser.close();
}
