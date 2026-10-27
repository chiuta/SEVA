// SEVA 2.1 — blocurile „Surse și revizuire”: doar surse verificate (lista de mai jos, fiecare consultată pe web la 2026-10-27),
// marcaje de acoperire traduse în 8 limbi, secțiunile fără sursă rămân „de completat”. Nu validează conținutul medical.
// Rulare: node tests/sources.test.mjs
import fs from "node:fs"; import path from "node:path"; import {fileURLToPath} from "node:url";
const R = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const h = fs.readFileSync(path.join(R, "index.html"), "utf8");
let pass = 0, fail = 0; const ok = (c, m, x) => { if (c) pass++; else { fail++; console.log("  FAIL", m, x === undefined ? "" : JSON.stringify(x).slice(0, 250)); } };
// URL-uri verificate (WebFetch / WebSearch la 2026-10-27). Orice URL nou în blocurile de surse trebuie adăugat aici DOAR după verificare.
const VERIFIED = new Set([
  "https://www.aasm.org/resources/pdf/adultsleepdurationconsensus.pdf",
  "https://nhs.uk/mental-health/self-help/guides-tools-and-activities/breathing-exercises-for-stress",
  "https://nhsinform.scot/illnesses-and-conditions/muscle-bone-and-joints/pain-and-injuries-after-exercise",
  "https://doi.org/10.1136/bjsports-2020-102955",
  "https://www.aao.org/eye-health/diseases/what-is-eye-strain",
  // adăugate în 2.0.1 (verificate la acea rundă; vezi CHANGELOG)
  "https://www.who.int/about/governance/constitution", "https://www.nature.com/articles/138032a0", "https://www.nobelprize.org/prizes/medicine/2017/press-release/",
  "https://www.who.int/news-room/fact-sheets/detail/healthy-diet", "https://www.who.int/europe/publications/i/item/9789240014886", "https://www.who.int/publications/i/item/9789240003927",
  "https://doi.org/10.1002/ejsp.674", "https://www.antisuicid.ro", "https://findahelpline.com/ro-RO",
]);
const box = id => { const i = h.indexOf('data-src="' + id + '"'); const j = h.indexOf('<div class="src-date">', i); return h.slice(i, j); };
const SECS = ["sec-acasa", "sec-istorie", "sec-circadian", "sec-somn", "sec-respiratie", "sec-nutritie", "sec-miscare", "sec-recuperare", "sec-postura", "sec-mindfulness", "sec-stres", "sec-jurnal", "sec-structura", "sec-trusa", "sec-calculatoare", "sec-provocari", "sec-quiz", "sec-glosar"];
for (const id of SECS) ok(h.includes('data-src="' + id + '"'), "bloc de surse în " + id);
const srcAnchors = [...h.matchAll(/data-src="sec-[a-z]+">[\s\S]*?<div class="src-date">/g)].flatMap(m => [...m[0].matchAll(/<a href="([^"]+)"/g)].map(x => x[1]));
for (const u of srcAnchors) ok(VERIFIED.has(u), "URL de sursă în lista verificată: " + u);
// secțiunile completate în 2.1.0
const WITH = {"sec-respiratie": ["nhs.uk/mental-health"], "sec-recuperare": ["nhsinform.scot"], "sec-postura": ["doi.org/10.1136/bjsports-2020-102955", "aao.org/eye-health"], "sec-structura": ["doi.org/10.1136/bjsports-2020-102955", "aao.org/eye-health"]};
for (const [id, needles] of Object.entries(WITH)) { const b = box(id); for (const n of needles) ok(b.includes(n), id + " conține " + n); ok(!/Surse: de completat/.test(b), id + " nu mai spune „de completat” în antet"); ok(/src-flag/.test(b) && /src-rest/.test(b), id + " are marcaj de acoperire și «restul: de completat»"); }
// secțiunile fără sursă verificată rămân marcate
for (const id of ["sec-trusa", "sec-calculatoare", "sec-provocari", "sec-quiz", "sec-glosar"]) ok(/Surse: de completat/.test(box(id)), id + " rămâne „de completat” (nicio sursă inventată)");
// data și mențiunea de revizuire
ok((h.match(/Ultima actualizare a listei de surse: 2026-10-27/g) || []).length >= 18, "data listei de surse în toate blocurile");
ok((h.match(/Revizuire a conținutului de către un specialist: neefectuată/g) || []).length >= 18, "revizuirea de către specialist rămâne «neefectuată»");
// traduceri: fiecare marcaj nou are 8 variante, diferite de textul român (în afara ro)
const rows = JSON.parse(h.match(/id="seva-i18n-data">([\s\S]*?)<\/script>/)[1]);
const flags = [...h.matchAll(/<div class="src-flag">([^<]+)<\/div>/g)].map(m => m[1]);
for (const f of flags) { const r = rows.find(x => x[0] === f); ok(!!r && r.length === 8 && r.every(v => v && v.length > 10) && new Set(r).size === 8, "traducere în 8 limbi pentru marcajul: " + f.slice(0, 50)); }
// interfață: marcajul nou se traduce în pagină (en, hu) și nu apar erori
const {launch} = await import("./_lib.mjs");
for (const [lang, re] of [["en", /^Note: the cited source only describes slow belly breathing/], ["hu", /^Figyelem: az idézett forrás csak a lassú hasi légzést/], ["ro", /^Atenție: sursa citată descrie doar respirația lentă/]]) {
  const L = await launch({init: "localStorage.setItem('fff.seva.lang','" + lang + "')"});
  await L.page.waitForSelector('[data-src="sec-respiratie"] .src-flag', {state: "attached"}); await L.page.waitForTimeout(500);
  const t = await L.page.evaluate(() => document.querySelector('[data-src="sec-respiratie"] .src-flag').textContent.trim());
  ok(re.test(t), "marcaj tradus în pagină (" + lang + ")", t.slice(0, 80)); ok(L.st.errs.length === 0, "fără erori JS (" + lang + ")", L.st.errs); await L.browser.close();
}
console.log(`\n${pass} reușite, ${fail} eșuate`); process.exit(fail ? 1 : 0);
