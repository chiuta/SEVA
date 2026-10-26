// SEVA 2.0 — jurnal de somn și ritm: ora de culcare/trezire/energie, tipare locale, legături spre ghid, fără diagnostic.
import fs from "fs";
import os from "os";
import path from "path";
import {launch, axeRun, hOverflow, check, summary} from "./_lib.mjs";

const goJournal = page => page.evaluate(() => document.querySelector('.navlink[data-sec="jurnal"]').click());
const save = async (page, date, bed, wake, energy) => {
  await page.fill("#jDate", date); await page.fill("#jBed", bed || ""); await page.fill("#jWake", wake || "");
  await page.selectOption("#jEnergy", energy ? String(energy) : ""); await page.fill("#jSleep", "");
  await page.click("#jSaveBtn");
};

console.log("1. funcția pură");
{
  const {browser, page, st} = await launch();
  await page.waitForFunction(() => window.__seva);
  const P = e => page.evaluate(x => window.__seva.sleepPatterns(x), e);
  check("sub 3 intrări: doar n", JSON.stringify(await P([{date: "2026-10-19", bed: "23:00", wake: "07:00"}, {date: "2026-10-20", bed: "23:00", wake: "07:00"}])) === '{"n":2}');
  check("fără ore valide: n=0", (await P([{date: "2026-10-19"}, {bed: "25:00", wake: "07:00"}, {bed: "07:00", wake: "07:00"}, {bed: "01:00", wake: "20:00"}])).n === 0);
  // trecere peste miezul nopții: 23:30 și 00:30 → medie 00:00; durate 7h și 8h
  const m = await P([{date: "2026-10-19", bed: "23:30", wake: "07:00"}, {date: "2026-10-20", bed: "00:30", wake: "08:30"}, {date: "2026-10-21", bed: "23:30", wake: "07:00"}, {date: "2026-10-22", bed: "00:30", wake: "08:30"}]);
  check("n=4", m.n === 4);
  check("culcare medie ≈ 00:00 (axă continuă 12→12)", Math.abs(((m.bedMean % 1440) + 1440) % 1440 - 0) < 1, m.bedMean);
  check("durată medie 7,75 h", Math.abs(m.durMean - 7.75) < 1e-9, m.durMean);
  check("SD culcare ≈ 34,6 min (n-1)", Math.abs(m.bedSd - 34.641) < 0.01, m.bedSd);
  check("regularitate: oarecum variabilă (30–60)", m.reg === "oarecum variabilă", m.reg);
  check("fără comparație weekend (zile lucrătoare doar)", m.social === undefined);
  // weekend: sâmbătă/duminică (2026-10-24/25) cu culcare cu 2 h mai târziu
  const w = await P([{date: "2026-10-19", bed: "23:00", wake: "07:00"}, {date: "2026-10-20", bed: "23:00", wake: "07:00"}, {date: "2026-10-21", bed: "23:00", wake: "07:00"}, {date: "2026-10-24", bed: "01:00", wake: "09:00"}, {date: "2026-10-25", bed: "01:00", wake: "09:00"}]);
  check("social: weekendul +120 min", w.social && w.social.diff === 120 && w.social.nFree === 2 && w.social.nWork === 3, w.social);
  check("regularitate: foarte variabilă (>60)", w.reg === "foarte variabilă", w.bedSd);
  // energie
  const en = [];
  for (let i = 0; i < 8; i++) en.push({date: "2026-10-" + (19 + i % 5), bed: "23:00", wake: i < 4 ? "05:00" : "07:30", energy: i < 4 ? 2 : 4});
  const e = await P(en);
  check("energie: split lung/scurt", e.energySplit && e.energySplit.long === 4 && e.energySplit.short === 2 && e.energySplit.nLong === 4 && e.energySplit.nShort === 4, e.energySplit);
  const flat = await P(en.map(x => ({...x, wake: "07:00"})));
  check("nopți identice: fără split", flat.energySplit === undefined);
  check("energie ignorată în afara 1–5", (await P([{date: "2026-10-19", bed: "23:00", wake: "07:00", energy: 9}, {date: "2026-10-20", bed: "23:00", wake: "07:00", energy: 0}, {date: "2026-10-21", bed: "23:00", wake: "07:00"}])).energyMean === undefined);
  check("0 erori", st.errs.length === 0, st.errs);
  await browser.close();
}

console.log("2. interfață: salvare, durată automată, tipare, legături");
{
  const {browser, page, st} = await launch({bypassCSP: true});
  await page.waitForTimeout(800);
  await goJournal(page);
  check("câmpurile noi există", await page.isVisible("#jBed") && await page.isVisible("#jWake") && await page.isVisible("#jEnergy"));
  check("fără intrări: mesaj de îndrumare", /cel puțin 3 intrări/.test(await page.textContent("#sleepPatterns")));
  // 7 nopți: culcare foarte neregulată + weekend târziu + energie mică
  const rows = [["2026-10-19", "22:00", "06:00", 4], ["2026-10-20", "01:30", "07:00", 2], ["2026-10-21", "23:00", "06:30", 3], ["2026-10-22", "02:00", "07:30", 2], ["2026-10-23", "22:30", "06:30", 3], ["2026-10-24", "03:00", "11:00", 2], ["2026-10-25", "02:30", "10:30", 1]];
  for (const r of rows) await save(page, ...r);
  const hist = await page.textContent("#journalHistory");
  check("durata somnului s-a calculat din ore (8 h)", /somn 8h/.test(hist) && /culcare 22:00 → trezire 06:00/.test(hist) && /energie 4\/5/.test(hist), hist.slice(0, 300));
  const txt = await page.textContent("#sleepPatterns");
  check("intrări folosite: 7", /Intrări folosite: 7/.test(txt), txt);
  check("durata medie afișată", /Durata medie a somnului: \d(\.\d)? h/.test(txt));
  check("regularitate foarte variabilă", /foarte variabilă/.test(txt));
  check("comparație weekend afișată", /Mijlocul somnului în weekend este cu \d+ min mai târziu/.test(txt), txt);
  check("energia medie afișată", /Energia medie notată: 2\.4\/5 \(din 7 intrări\)/.test(txt), txt);
  check("avertisment: nu e diagnostic", /nu sunt un diagnostic/.test(await page.textContent("#sleepPatternsH + .panel")));
  const goto = await page.$$eval("#sleepPatterns [data-goto]", b => b.map(x => x.dataset.goto));
  check("legături spre circadian, structură, somn, recuperare, respirație, ajutor", ["circadian", "structura", "somn", "recuperare", "respiratie", "ajutor"].every(g => goto.includes(g)), goto);
  await page.click('#sleepPatterns [data-goto="circadian"]');
  check("clic pe legătură deschide secțiunea", await page.evaluate(() => document.getElementById("sec-circadian").classList.contains("active")));
  await goJournal(page);
  // salvarea din nou a aceleiași zile înlocuiește (nu dublează)
  await save(page, "2026-10-19", "23:00", "07:00", 3);
  check("aceeași zi: înlocuire", /Intrări folosite: 7/.test(await page.textContent("#sleepPatterns")));
  // export conține câmpurile noi
  const [dl] = await Promise.all([page.waitForEvent("download"), page.click("#jExportBtn")]);
  const exp = JSON.parse(fs.readFileSync(await dl.path(), "utf8"));
  const e19 = exp.seva_jurnal.find(x => x.date === "2026-10-19");
  check("export: bed/wake/energy", e19 && e19.bed === "23:00" && e19.wake === "07:00" && e19.energy === 3, e19);
  // nimic persistat în browser în afară de limbă (design SEVA: doar în memorie)
  const keys = await page.evaluate(() => Object.keys(localStorage));
  check("jurnalul nu e scris în localStorage", keys.every(k => !/jurnal|journal|bed|sleep/i.test(k)) && !(await page.evaluate(() => JSON.stringify(localStorage))).includes("2026-10-19"), keys);
  check("0 erori", st.errs.length === 0, st.errs);
  check("0 cereri de rețea", st.net.length === 0, st.net);
  check("0 violări CSP", (await page.evaluate(() => window.__csp)).length === 0);
  await page.mouse.move(0, 0); await page.waitForTimeout(250);
  const ax = await axeRun(page);
  check("axe: 0 încălcări", ax === null || ax.length === 0, ax);
  await browser.close();
}

console.log("3. import sigur + engleză");
{
  const {browser, page, st} = await launch();
  await page.waitForTimeout(800);
  await goJournal(page);
  const f = path.join(os.tmpdir(), "seva-imp-" + process.pid + ".json");
  fs.writeFileSync(f, JSON.stringify({seva_jurnal: [
    {date: "2026-10-19", bed: "23:00", wake: "07:00", energy: 3},
    {date: "2026-10-20", bed: "25:99", wake: "<img src=x onerror=window.__pwn=1>", energy: 9},
    {date: "2026-10-21", bed: "00:00", wake: "08:00", energy: 4.4},
    {date: "2026-10-22", bed: "23:30", wake: "07:30"}]}));
  await page.setInputFiles("#jImportFile", f); await page.waitForTimeout(400); fs.unlinkSync(f);
  const st2 = await page.evaluate(() => window.__seva.sleepPatterns([]).n);
  check("import acceptat", /Importat: 4 intrări/.test(await page.textContent("#jExportStatus")));
  const txt = await page.textContent("#sleepPatterns");
  check("doar 3 intrări valide folosite (bed/wake invalide sunt anulate)", /Intrări folosite: 3/.test(txt), txt);
  check("energie 9 ignorată, 4.4 → 4", /Energia medie notată: 3\.5\/5 \(din 2 intrări\)/.test(txt), txt);
  check("fără injecție prin câmpurile importate", !(await page.evaluate(() => window.__pwn)) && (await page.$$("#sleepPatterns img")).length === 0);
  await page.evaluate(() => SEVAI.setLang("en")); await page.waitForTimeout(400);
  const en = await page.textContent("#sleepPatterns");
  check("engleză: textul se re-randează tradus", /Entries used: 3/.test(en) && /Average sleep duration/.test(en) && !/Durata medie/.test(en), en);
  check("engleză: etichetele câmpurilor", /Bedtime/.test(await page.textContent("#sec-jurnal")) && /Daytime energy/.test(await page.textContent("#sec-jurnal")));
  for (const l of ["fr", "it", "es", "pt", "de", "hu"]) {
    await page.evaluate(x => SEVAI.setLang(x), l); await page.waitForTimeout(150);
    const tx = await page.textContent("#sleepPatterns");
    check("limba " + l + ": fără română rămasă", !/Intrări folosite|Durata medie|De citit/.test(tx), tx.slice(0, 120));
  }
  await page.evaluate(() => SEVAI.setLang("ro"));
  check("0 erori", st.errs.length === 0, st.errs);
  await browser.close();
}

console.log("4. telefon");
{
  const {browser, page} = await launch({w: 360, h: 740});
  await page.waitForTimeout(800);
  await goJournal(page);
  await save(page, "2026-10-19", "23:00", "07:00", 3); await save(page, "2026-10-20", "23:00", "07:00", 3); await save(page, "2026-10-21", "02:00", "07:00", 3);
  check("fără depășire orizontală la 360 px", (await hOverflow(page)) <= 0, await hOverflow(page));
  await browser.close();
}
summary();
