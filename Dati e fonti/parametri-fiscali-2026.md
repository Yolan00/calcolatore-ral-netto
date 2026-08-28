# Parametri fiscali e contributivi 2026 — fonti verificate

Anno d'imposta **2026**. Caso modellato: dipendente privato, tempo indeterminato, residente a Milano (Lombardia).
Verifica effettuata il **28/08/2026**.

Il corpo del documento contiene **solo norme e valori vigenti**. Le trappole note (valori superati, misure abrogate) sono confinate nell'appendice finale.

---

## 1. IRPEF nazionale

| Scaglione | Aliquota |
|---|---|
| fino a 28.000 € | 23% |
| 28.001 – 50.000 € | **33%** |
| oltre 50.000 € | 43% |

- Base: art. 11 co. 1 TUIR, modificato dall'art. 1 della **L. 30 dicembre 2025, n. 199** (Legge di Bilancio 2026). Numero e data confermati.
- La seconda aliquota scende dal 35% al 33%, in vigore **dal periodo d'imposta 2026**. Beneficio massimo ~440 €/anno.
- Per redditi complessivi **oltre 200.000 €** le detrazioni per oneri al 19% sono ridotte forfetariamente di 440 €, per sterilizzare il beneficio del taglio. Vigente ma **irrilevante nel nostro modello**, che non prevede oneri detraibili: da citare solo come limite dichiarato.
- Fonti: [MEF – Principali misure LdB 2026](https://www.mef.gov.it/focus/Principali-misure-della-legge-di-bilancio-2026/) · [Fisco Oggi – LdB 2026 approvata](https://www.fiscooggi.it/portale/-/legge-di-bilancio-2026-approvata-e-ufficiale) · [Confindustria Ancona – L. 199/2025](https://www.confindustria.an.it/legge-di-bilancio-2026-principali-novita-fiscali-l-n-199-2025/) · [MySolution – taglio detrazioni oltre 200k](https://www.mysolution.it/fisco/informazioni/news/2026/05/12/riordino-delle-detrazioni-taglio-forfettario-di-440-euro-irrilevante-nel-7302026/)

---

## 2. Contributi INPS — dipendente privato, FPLD

Fonte primaria: **circolare INPS n. 6 del 30 gennaio 2026** (valori in vigore dal 1° gennaio 2026).

| Voce | Valore 2026 |
|---|---|
| Aliquota IVS complessiva | 33% (**9,19% lavoratore** + 23,81% datore) |
| Aliquota aggiuntiva 1% (art. 3-ter D.L. 384/1992) | sulla quota eccedente la 1ª fascia |
| Prima fascia di retribuzione pensionabile | **56.224 €/anno** (4.685 €/mese) |
| Massimale annuo base contributiva e pensionabile | **122.295 €** (iscritti post 31/12/1995) |
| Minimale di retribuzione giornaliera | **58,13 €** (9,5% del trattamento minimo FPLD, 611,85 €/mese) |
| Rivalutazione ISTAT applicata | +1,4% (variazione 2025) |

**9,19% vs 9,49%** — l'aliquota a carico del lavoratore sale a **9,49% nelle aziende oltre i 15 dipendenti**, per lo 0,30% destinato al FIS. Il dettaglio varia per settore e dimensione (FIS / CIGS): la scelta del 9,19% è una semplificazione da dichiarare, non un errore.

- Fonti: [INPS – Limite minimo di retribuzione giornaliera 2026](https://www.inps.it/it/it/inps-comunica/notizie/dettaglio-news-page.news.2026.02.lavoratori-dipendenti-limite-minimo-di-retribuzione-giornaliera-2026.html) · [Consulenti del Lavoro – Contributi 2026](https://www.consulentidellavoro.it/home/storico-articoli/19330-contributi-2026-aggiornati-minimali-e-massimali) · [GEPS – circ. 6/26](https://www.geps.it/minimale-e-massimale-retributivi-2026-i-nuovi-valori-aggiornati-inps-circ-n-6-26-11055/) · [INPS – Aliquote contributive](https://www.inps.it/it/it/inps-comunica/diritti-e-obblighi-in-materia-di-sicurezza-sociale-nell-unione-e/per-le-imprese/aliquote-contributive.html)

---

## 3. Detrazione per lavoro dipendente — art. 13 TUIR

Si calcola sul **reddito complessivo** (= RAL − contributi, vedi §7).

| Reddito complessivo | Detrazione |
|---|---|
| fino a 15.000 € | 1.955 € |
| 15.001 – 28.000 € | 1.910 + 1.190 × (28.000 − R) / 13.000 |
| 28.001 – 50.000 € | 1.910 × (50.000 − R) / 22.000 |
| oltre 50.000 € | 0 |

- **Maggiorazione 65 €** per reddito complessivo tra **25.000 e 35.000 €**. Importo e fascia confermati; la collocazione esatta del comma (co. 1-bis / co. 1.1) resta da rileggere sul testo in GU.
- **Minimo garantito 690 €** (1.380 € per contratti a tempo determinato). Rilevante solo per rapporti di durata inferiore all'anno: fuori dal nostro caso.
- Fonti: [Brocardi – Art. 13 TUIR, testo vigente (agg. 04/07/2026)](https://www.brocardi.it/testo-unico-imposte-redditi/titolo-i/capo-i/art13.html) · [Fiscomania – Detrazioni lavoro dipendente 2026](https://fiscomania.com/detrazioni-per-redditi-da-lavoro-dipendente/)

**Discontinuità della funzione (comportamento voluto, non bug):**
- **15.000 → 15.000+ε**: da 1.955 a ~3.100 € (salto di ~1.145 €).
- **25.000** e **35.000**: due gradini da 65 € (ingresso/uscita dalla maggiorazione).
- **50.000**: *nessuna* discontinuità — la formula tende già a 0 per R → 50.000. La funzione è continua in questo punto.

---

## 4. Riduzione del cuneo fiscale — L. 207/2024, resa strutturale dalla L. 199/2025

Due misure distinte, che entrano nella catena in punti diversi.

### 4.A Somma esente (bonus cuneo)
Spetta se il **reddito complessivo ≤ 20.000 €**. La percentuale si applica al **reddito di lavoro dipendente**, non al reddito complessivo: sono due parametri concettualmente diversi, anche se nel nostro caso semplificato coincidono.

| Reddito di lavoro dipendente | Percentuale |
|---|---|
| fino a 8.500 € | 7,1% |
| 8.501 – 15.000 € | 5,3% |
| 15.001 – 20.000 € | 4,8% |

- **Importo massimo: 960 €/anno** (= 20.000 × 4,8%).
- **Non concorre alla formazione del reddito** ai fini IRPEF e **non è assoggettata a contribuzione INPS**. Non è una detrazione: non va sottratta dall'imposta, ma sommata al netto.
- Il reddito complessivo rilevante è calcolato al netto del reddito dell'abitazione principale e pertinenze.
- Fonti: [Agenzia Entrate – Circolare 4/E del 16/05/2025 (commento ADAPT)](https://www.bollettinoadapt.it/la-circolare-dellagenzia-delle-entrate-n-4-e-del-16-maggio-2025/) · [FiscoeTasse – Taglio cuneo, guida e FAQ AdE](https://www.fiscoetasse.com/new-rassegna-stampa/1178-taglio-cuneo-fiscale-ecco-le-novita-2025.html) · [InformazioneFiscale – Bonus cuneo nella CU 2026](https://www.informazionefiscale.it/cu-2026-dipendenti-novita-bonus-cuneo-fiscale-istruzioni)

### 4.B Ulteriore detrazione

| Reddito complessivo | Detrazione |
|---|---|
| 20.000 – 32.000 € | 1.000 € |
| 32.001 – 40.000 € | 1.000 × (40.000 − R) / 8.000 |
| oltre 40.000 € | 0 |

- È una **detrazione dall'imposta lorda**, quindi soggetta a capienza. Cumulabile con la detrazione art. 13, con quelle per familiari a carico e con il bonus mamme.
- Fonti: [Coverflex – Taglio cuneo 2026](https://www.coverflex.com/it/blog/taglio-cuneo-fiscale) · [Ipsoa – Cuneo fiscale](https://www.ipsoa.it/guide/cuneo-fiscale-funziona)

---

## 5. Addizionale regionale — Lombardia

Base: art. 72 **l.r. 10/2003**, come modificato dalla **l.r. 5/2022**. Si applica **per scaglioni** sul reddito complessivo ai fini IRPEF, al netto degli oneri deducibili.

| Scaglione | Aliquota |
|---|---|
| fino a 15.000 € | 1,23% |
| 15.001 – 28.000 € | 1,58% |
| 28.001 – 50.000 € | 1,72% |
| oltre 50.000 € | 1,73% |

> **Dettaglio non ovvio, e vigente:** la LdB 2026 proroga **fino al 2028** la facoltà per le Regioni di mantenere i propri scaglioni storici. La Lombardia ha quindi **4 scaglioni regionali** che convivono con i **3 scaglioni nazionali**. Le soglie regionali (15.000 / 28.000 / 50.000) non coincidono con quelle IRPEF: servono due tabelle separate nel motore.

- Fonti: [Regione Lombardia – Addizionale regionale all'IRPEF](https://www.regione.lombardia.it/bollo-auto-e-tributi-regionali/red-addizionale-regionale-irpef) · [Directio – Aliquote regionali 2026](https://directio.it/News/Details/11189/addizionale-regionale-irpef-aliquote-2026) · [PMI.it – vecchie aliquote fino al 2028](https://www.pmi.it/economia/mercati/481567/addizionali-irpef-vecchie-aliquote-fino-al-2028.html)

---

## 6. Addizionale comunale — Milano

| Voce | Valore |
|---|---|
| Aliquota | **0,80%** (unica, non a scaglioni) |
| Soglia di esenzione | **23.000 €** di reddito imponibile |
| Delibera | n. 46 del 28/09/2020, confermata annualmente (ultima conferma 20/12/2025) |

- L'esenzione **non è una franchigia**: superata la soglia si paga lo 0,8% sull'**intero imponibile**, non sull'eccedenza. Ne deriva una **discontinuità di ~184 €** a 23.001 € di imponibile.
- Fonti: [MEF – Portale del federalismo fiscale, scheda Milano](https://www1.finanze.gov.it/finanze2/dipartimentopolitichefiscali/fiscalitalocale/nuova_addcomirpef/risultato.htm?anno=9999&lista=1&pagina=lombardia.htm&cm=&pr=MI&cc=F205&r=1) · [Comune di Milano – Addizionale comunale IRPEF](https://www.comune.milano.it/en/argomenti/tributi/addizionale-comunale-irpef)

---

## 7. Regole di calcolo (non sono numeri, ma servono al motore)

1. **I contributi non sono oneri deducibili.** I contributi previdenziali obbligatori del dipendente **non concorrono a formare il reddito** ex **art. 51 co. 2 lett. a) TUIR** — non sono deduzioni ex art. 10. Il risultato numerico è identico, la motivazione no.
   → `reddito complessivo = RAL − contributi`. È questa la base per: scaglioni IRPEF, detrazione art. 13, soglie del cuneo, addizionali.

2. **Base delle addizionali** = reddito complessivo determinato ai fini IRPEF **al netto degli oneri deducibili** (art. 50 D.Lgs. 446/1997). Non è l'imponibile al netto delle detrazioni.

3. **Le addizionali sono dovute solo se l'IRPEF è dovuta.** Art. 50 D.Lgs. 446/1997: l'addizionale è dovuta solo se, per lo stesso anno, risulta dovuta l'IRPEF **dopo aver scomputato le detrazioni** e i crediti d'imposta. Escluso il prelievo anche per IRPEF netta **non superiore a 12 €**. → serve un controllo di incapienza *prima* del blocco addizionali.
   Fonte: [Dipartimento Finanze – Disciplina del tributo](https://www.finanze.gov.it/it/fiscalita/fiscalita-regionale-e-locale/Addizionale-regionale-allIRPEF/disciplina-del-tributo/)

4. **Capienza generale:** `IRPEF netta = max(0, imposta lorda − detrazioni)`. Le detrazioni non generano credito.

---

## 8. Trattamento integrativo — vigente, non presente nel brief iniziale

**Ancora in vigore nel 2026**: la LdB 2026 non lo ha modificato. Riferimento: **art. 1 D.L. 3/2020**, conv. L. 21/2020.
È **cumulabile** con entrambe le misure del cuneo: sono istituti distinti, chi rientra nei requisiti di entrambi li riceve insieme in busta paga.

| Reddito complessivo | Spettanza |
|---|---|
| fino a 15.000 € | **1.200 €/anno**, a condizione che l'imposta lorda sia **superiore alla detrazione art. 13 diminuita di 75 €** |
| 15.001 – 28.000 € | solo se la somma di determinate detrazioni (familiari a carico, lavoro dipendente, mutui prima casa ante 2021) **supera l'imposta lorda**; spetta per la differenza, max 1.200 € |
| oltre 28.000 € | non spetta |

- È un **credito erogato in busta paga**, non una detrazione: aumenta il netto anche in assenza di capienza.
- Fonti: [Fiscomania – Trattamento integrativo 2026](https://fiscomania.com/trattamento-integrativo-come-funziona/) · [Studio Mattonai – Disciplina vigente 2026](https://www.studiomattonai.it/2026/03/06/trattamento-integrativo-2026-disciplina-vigente-misure-speciali-15-e-detassazioni-su-voci-retributive/) · [Factorial – Novità 2026](https://factorial.it/blog/come-funziona-il-trattamento-integrativo/)

### 8.1 Perimetro effettivo nel nostro modello (calcolato)

Con aliquota contributiva 9,19% e nessun familiare a carico né mutuo, il TI incide **solo in una banda ristretta di RAL**:

- **Prima condizione** (R ≤ 15.000): `0,23 × R > 1.955 − 75` → **R > 8.174 €** → **RAL > ~9.002 €**
- **Limite superiore**: R ≤ 15.000 → **RAL ≤ ~16.518 €**

→ **Il TI vale 1.200 € piatti per RAL tra ~9.000 e ~16.518 €. Fuori da questa banda è zero.**

- **Seconda condizione (15.001 – 28.000 €): irraggiungibile sotto le nostre assunzioni.** Richiede `detrazione art. 13 > imposta lorda`; le due curve si incrociano a R ≈ 13.911 €, cioè *sotto* i 15.000. Da R = 15.001 in poi l'imposta lorda (3.450 €) supera stabilmente la detrazione (3.100 €) e il divario si allarga. Il ramo diventa raggiungibile solo introducendo detrazioni per familiari a carico o mutui ante 2021, che il modello esclude.
  → **Va implementato solo il primo ramo**, documentando che il secondo è dimostrabilmente inattivo date le assunzioni.

---

## 9. Riepilogo scostamenti rispetto al brief iniziale

**Confermati senza modifiche:** tutti i valori numerici della §5 del brief — scaglioni IRPEF, 9,19%, 1% aggiuntivo, 56.224, 122.295, 58,13, detrazione art. 13 e maggiorazione 65 €, percentuali cuneo 7,1/5,3/4,8, ulteriore detrazione 1.000 €, scaglioni Lombardia, Milano 0,8% / 23.000.

**Da correggere nel brief:**
- La detrazione art. 13 **non ha discontinuità a 50.000 €** (è continua). Il caso di test "RAL 50.001" verifica il passaggio 33%→43% e l'aliquota regionale, non uno scalino della detrazione.
- I contributi **non sono oneri deducibili**: non concorrono al reddito (art. 51 co. 2 lett. a TUIR).

**Da aggiungere alla catena di calcolo:**
- Controllo di incapienza: addizionali non dovute se IRPEF netta = 0 (o ≤ 12 €).
- Trattamento integrativo, primo ramo (§8.1).
- Cap di 960 € sulla somma esente.
- Cap del massimale contributivo a 122.295 € (solo iscritti post-1995: assunzione da dichiarare).

**Unico punto ancora aperto:** collocazione esatta del comma della maggiorazione 65 € (l'importo e la fascia sono certi, il numero del comma va riletto in GU).

---

## Appendice — valori e regole NON vigenti, da non usare

Elencati solo perché circolano ancora in rete e possono contaminare il confronto con i calcolatori online.

| Trappola | Realtà 2026 |
|---|---|
| 4 scaglioni IRPEF con 25% tra 15.000 e 28.000 | regime 2023, superato |
| Seconda aliquota IRPEF al 35% | regime 2024–2025, ora 33% |
| Massimale contributivo 119.650 / 120.607 | valori 2024 / 2025, ora 122.295 |
| Prima fascia pensionabile 52.190 / 55.008 | valori di anni precedenti, ora 56.224 |
| Taglio del cuneo come *esonero contributivo* | abolito dal 2025: i contributi restano interi al 9,19% |
| Detrazione art. 13 "+50 € tra 25.001 e 29.000" | non confermato dal testo dell'articolo: la maggiorazione è 65 € tra 25.000 e 35.000 |

Nota metodologica: diversi calcolatori online ignorano la maggiorazione di 65 €, il trattamento integrativo o la regola di incapienza sulle addizionali. In caso di scostamento va indagata la causa, non assunto che l'errore sia nostro.
