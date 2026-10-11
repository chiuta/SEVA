# SEVA — Enciclopedia stării de bine

Ghid complet despre starea de bine, într-un singur fișier HTML, fără cont și fără urmărire.

**Live:** https://chiuta.github.io/SEVA/

**Ultima actualizare:** 11 octombrie 2026 · versiune 1.3.2

![Captura de ecran](screenshot.png)

## Ce este

SEVA este o enciclopedie interactivă (în română) despre somn, ritm circadian, respirație, nutriție, mișcare, recuperare, postură, mindfulness, stres, jurnal și obiceiuri, cu unelte practice. Aplicația precizează că nu înlocuiește îngrijirea medicală sau psihologică și că oferă referință și unelte de auto-observare, nu diagnostic sau tratament.

## Funcții

Conținutul este organizat în secțiuni numerotate (meniu lateral, ☰ pe mobil):

- Orientare: Acasă, Istorie & știință.
- Ritmurile corpului: Ritm circadian (cadran interactiv desenat în SVG), Somnul, Respirația.
- Corpul: Nutriție & hidratare, Mișcare & antrenament, Recuperare, Postură & ergonomie.
- Mintea: Mindfulness & meditație, Stres & reglare, Jurnal & obiceiuri.
- Practică de zi cu zi: O zi echilibrată, Trusa de wellness, Calculatoare & unelte, Provocări & obiective.
- Resurse: Când ai nevoie de ajutor, Test de cunoștințe (cu certificat de finalizare), Glosar A-Z.
- Perspectivă: Tablou de bord & tipare.
- Confort de citire în bara laterală: mărime text (A−/A+, 100–150%), „Text lizibil” (font sans-serif cu spațiere mărită) și „Contrast” ridicat; se activează automat contrastul ridicat dacă sistemul îl cere (`prefers-contrast: more`). Setările există doar în sesiune (nu se salvează nimic în browser).
- Tema inițială urmează preferința sistemului (`prefers-color-scheme`); scurtătura `/` mută focusul pe căutarea globală.
- Căutare globală, temă Zi/Noapte, indicator „faza zilei", tipărirea secțiunii curente, „Verifică integritatea fișierului" (SHA-256 al DOM-ului la încărcare), „Din ce e făcut fișierul" și „Raportează o eroare" (link GitHub).
- Jurnalul, notițele personale, progresul de repetiție spațiată și certificatul se pot exporta/importa ca fișiere JSON.

## Manual de utilizare

1. Navighează din meniul lateral (☰ pe telefon) sau din căutarea globală (⌕).
2. Comută tema cu „☾ Noapte" / „☀ Zi".
3. Folosește secțiunile interactive (cadranul circadian, exercițiile de respirație, calculatoarele, testul BOLT etc.) direct în pagină.
4. În §11 Jurnal & obiceiuri: jurnalul trăiește doar în memorie cât timp pagina e deschisă și dispare la reîncărcare. Apasă „💾 Exportă jurnalul (.json)" pentru a-l salva ca `seva-jurnal.json` și „📂 Importă" pentru a-l reîncărca într-o vizită viitoare (există și „Distribuie fișierul").
5. Notițele (`seva-notite.json`) și progresul de repetiție spațiată (`seva-repetitie-spatiata.json`) se salvează tot prin „💾 Exportă (.json)" și „💾 Exportă progresul", iar reîncărcarea prin „📂 Importă" / „📂 Importă progresul".
6. În §17 Test de cunoștințe completează numele pentru certificat și apasă „Generează certificat"; certificatul se descarcă ca `seva-certificat.json`.
7. „Printează secțiunea curentă" tipărește secțiunea deschisă.

## Confidențialitate și rețea

- Aplicația spune explicit că nu folosește localStorage, sessionStorage sau cookies; în cod nu există apeluri către acestea. Starea există doar în memorie până la reîncărcare, în afară de fișierele pe care le exporți tu.
- Nu face cereri de rețea (fără `fetch`, CDN sau scripturi externe). Conține doar link-uri, deschise la click: mentalhealthforromania.org, findahelpline.com, antisuicid.ro, who.int, sleepfoundation.org, github.com (raportare erori), trom.tf, Patreon și chiuta.github.io.

## Rulare locală / offline

Descarcă `index.html` și deschide-l în browser; nu necesită internet (link-urile externe se deschid doar la click).

## Istoric / Changelog

### 11 octombrie 2026 (v1.3.2)
- Confort de citire (mărime text, text lizibil, contrast ridicat), tema inițială după preferința sistemului, scurtătura `/`, suport `forced-colors`.
- Corectat aspectul barei de unelte din subsol (linkurile de raportare/tipărire/integritate erau strânse pe un singur rând); cadranele circadiene se micșorează pe ecrane înguste.
- Politica CSP: `script-src` cu hash în loc de `'unsafe-inline'`.
- Captura de ecran actualizată.

### 11 octombrie 2026 (v1.3.1)
- Căutarea globală și glosarul ignoră acum diacriticele („meditatie” găsește „meditație”).
- Accesibilitate: bară superioară mobilă ca <header>, ordinea titlurilor corectată (axe: 0 violări).
- Adăugat CSP strict (fără conexiuni de rețea); versiune în aplicație 1.3.1.

## Licență

Licența nu este încă declarată explicit în acest repository; vezi nota din aplicație. Aplicația se descrie ca „trade-free" și nu citează o licență anume.

## Autor

Alexio — Alexandru-Ionuț Chiuță, contact: alexio@trom.tf

## English summary

SEVA is a single-file Romanian-language encyclopedia of well-being: circadian rhythm, sleep, breathing, nutrition, movement, recovery, posture, mindfulness, stress, habits, with calculators, a journal, a knowledge quiz with a completion certificate and a glossary. It is not medical advice. It has reading-comfort options (text size, readable font, high contrast; session only). It stores nothing in the browser (journal, notes and progress are exported/imported as JSON) and makes no network requests.

## Audit

Audit: 2026-10-10 — verificat: 0 erori JS, 0 cereri de rețea, 0 utilizări de localStorage/sessionStorage/cookies; axe (WCAG 2.1 AA) rulat pe toate secțiunile, în tema de noapte, de zi și pe mobil, fără încălcări serious/critical după corecturile de contrast. Conținutul de sănătate este informativ și nu a fost validat medical; numărul TelVerde Antisuicid (0800 801 200) și programul lui pot fi modificate de operator.
