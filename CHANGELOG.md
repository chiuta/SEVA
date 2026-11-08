# Jurnal de modificări — SEVA

## 2.2.5 — 2026-11-08
În fiecare casetă «Surse și revizuire» (20) s-a adăugat linia «Informații cu caracter general; nu înlocuiesc evaluarea medicală individuală.», tradusă în 8 limbi (rând nou în pachetul i18n).

## 2.2.2 — 2026-11-03

Destinații «Trimite către…» pentru pașaportul de învățare: adăugate FENARIUM și MENSURA (registrul de aplicații-țintă reinjectat din hub).

## 2.2.1 — 2026-11-03

Pașaport de învățare comun (FFF): „Notează în pașaport”, repetări eșalonate, export/import passport/fff și certificat tipărabil auto-declarat; local, fără server.

## 2.2.0 — 2026-11-02 (reîmprospătare kit)

- Nou (kit): **Sincronizare între dispozitive** (`FFF.sync`) — în dialogul «Transparență» (clic pe versiune → Copie de siguranță): conectezi două dispozitive direct (WebRTC, cod/QR, fără server și fără cont) și își schimbă datele aplicației; cea mai recentă valoare câștigă, secretele (chei API, parole) nu se trimit, ștergerile nu se propagă. Aplicarea trece prin importul kitului (confirmare, chei permise, rollback).
- Nou (kit): **Istoric local — «mașina timpului»** (`FFF.history`) — instantanee automate ale datelor (IndexedDB, fără secrete), diferență față de starea curentă și restaurare reversibilă; «Șterge datele aplicației» șterge și istoricul.
- Module adăugate: `qr`, `p2p`, `sync`, `history` (+~140 KB). Versiunea aplicației nu se schimbă.

## 2.2.0 — 2026-11-01

- Corectat: adaptorul «Trimite la…» nu mai aruncă eroare când kitul FFF lipsește (gardian pe fiecare bloc; găsit de testul «fără kit» din CI).

Nou: «Trimite la…» (fff-kit, modulul FFF.bridge) — după orice export de fișier (GPX, ICS, CSV, Markdown) apare butonul «Trimite la…» către aplicațiile compatibile, iar importul de fișiere al aplicației primește plicuri .fff.json trimise de ele, cu confirmare înainte de import. Fără rețea, fără telemetrie.

## 2.1.0 — 2026-10-27 (anterior: 2.0.1)

Doar surse; conținutul de sănătate nu a fost modificat.

- Surse verificate pe web la 2026-10-27 pentru: Respirație (NHS), Recuperare (NHS inform), Postură și O zi echilibrată (OMS 2020, Bull et al., BJSM; AAO pentru regula 20-20-20). Fiecare bloc are marcaj despre ce NU acoperă sursa (8 limbi; fr/it/es/pt/de/hu: traducere automată) și „restul afirmațiilor: sursă de completat”.
- Semnalat în aplicație: sursa de recuperare nu confirmă „mișcarea ușoară ajută mai mult decât repausul complet” (de verificat).
- Test nou: `tests/sources.test.mjs` (68 de verificări).
- Rămân „Surse: de completat”: trusa de wellness, calculatoare, provocări, quiz, glosar. Revizuire de specialist: neefectuată.

## 2.0.1 — 2026-10-27 (anterior: 2.0.0)

Doar texte/structură; conținutul de sănătate nu a fost modificat.

- Bloc „Surse și revizuire” la finalul fiecărei secțiuni (20), în 8 limbi, doar cu surse verificate pe web la 2026-10-27 (OMS, AASM/SRS, Nobel 2017, Selye 1936, Kabat-Zinn 1982, Lally 2010); acolo unde nu există: „Surse: de completat”.
- Data „ultima actualizare a listei de surse: 2026-10-27” este explicit limitată la adăugarea listelor; revizuirea de către un specialist este marcată „neefectuată”.
- Semnalat în aplicație: „7–9 ore” (Somn) vs „7 ore sau mai mult” în sursa citată; numerele din „Când ai nevoie de ajutor” nereverificate.
- README: „Stare: experimental”, „Offline: complet”.
- Nu implementat: surse pentru secțiunile marcate „de completat”; revizuire a conținutului de către un specialist.
