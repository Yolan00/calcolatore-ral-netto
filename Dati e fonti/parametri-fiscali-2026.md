# Parametri fiscali e contributivi 2026 — fonti verificate

Anno d'imposta **2026**. Caso modellato: dipendente privato, tempo indeterminato, residente a Milano (Lombardia). Verifica effettuata il **28/08/2026**.

Il corpo contiene solo norme e valori vigenti. Le trappole note sono in appendice.

---

## 1. IRPEF nazionale

| Scaglione | Aliquota |
|---|---|
| fino a 28.000 € | 23% |
| 28.001 – 50.000 € | **33%** |
| oltre 50.000 € | 43% |

Art. 11 co. 1 TUIR, modificato dalla **L. 30 dicembre 2025, n. 199**. La seconda aliquota scende dal 35% al 33% dal periodo d'imposta 2026; beneficio massimo ~440 €/anno.

Oltre 200.000 € di reddito complessivo le detrazioni per oneri al 19% sono ridotte di 440 €, a sterilizzare il beneficio. Vigente ma irrilevante qui: il modello non prevede oneri detraibili.

Fonti: [MEF](https://www.mef.gov.it/focus/Principali-misure-della-legge-di-bilancio-2026/) · [Fisco Oggi](https://www.fiscooggi.it/portale/-/legge-di-bilancio-2026-approvata-e-ufficiale) · [MySolution — taglio oltre 200k](https://www.mysolution.it/fisco/informazioni/news/2026/05/12/riordino-delle-detrazioni-taglio-forfettario-di-440-euro-irrilevante-nel-7302026/)

---

## 2. Contributi INPS — dipendente privato, FPLD

Fonte primaria: **circolare INPS n. 6 del 30 gennaio 2026**.

| Voce | Valore 2026 |
|---|---|
| Aliquota IVS complessiva | 33% (**9,19% lavoratore** + 23,81% datore) |
| Aliquota aggiuntiva 1% | sulla quota eccedente la 1ª fascia, per regimi con aliquota lavoratore < 10% (art. 3-ter D.L. 384/1992, conv. L. 438/1992) |
| Prima fascia di retribuzione pensionabile | **56.224 €/anno** (4.685 €/mese) |
| Massimale base contributiva e pensionabile | **122.295 €** (iscritti post 31/12/1995) |
| Minimale di retribuzione giornaliera | **58,13 €** (9,5% del trattamento minimo FPLD, 611,85 €/mese) |
| Rivalutazione ISTAT | +1,4% |

Riscontro incrociato: la prima fascia 2025 vale 55.448 €, e 55.448 × 1,014 = 56.224. La rivalutazione conferma entrambi i valori.

**9,19% vs 9,49%:** l'aliquota sale a 9,49% oltre i 15 dipendenti, per lo 0,30% destinato al FIS. Il dettaglio varia per settore e dimensione (FIS / CIGS): usare 9,19% è una semplificazione da dichiarare, non un errore.

Fonti: [INPS — minimali 2026](https://www.inps.it/it/it/inps-comunica/notizie/dettaglio-news-page.news.2026.02.lavoratori-dipendenti-limite-minimo-di-retribuzione-giornaliera-2026.html) · [Consulenti del Lavoro](https://www.consulentidellavoro.it/home/storico-articoli/19330-contributi-2026-aggiornati-minimali-e-massimali) · [INPS — aliquote contributive](https://www.inps.it/it/it/inps-comunica/diritti-e-obblighi-in-materia-di-sicurezza-sociale-nell-unione-e/per-le-imprese/aliquote-contributive.html)

---

## 3. Detrazione per lavoro dipendente — art. 13 TUIR

Si calcola sul reddito complessivo (= RAL − contributi, vedi §6).

| Reddito complessivo | Detrazione |
|---|---|
| fino a 15.000 € | 1.955 € |
| 15.001 – 28.000 € | 1.910 + 1.190 × (28.000 − R) / 13.000 |
| 28.001 – 50.000 € | 1.910 × (50.000 − R) / 22.000 |
| oltre 50.000 € | 0 |

- **Maggiorazione 65 €** al **comma 1.1**, per reddito *"superiore a 25.000 euro ma non a 35.000 euro"*. La formulazione della norma giustifica il confronto stretto sulla soglia inferiore e inclusivo su quella superiore.
- **Minimo garantito 690 €** (1.380 € a tempo determinato): rileva solo per rapporti sotto l'anno, fuori dal nostro caso.

**Discontinuità della funzione** (volute, non bug): a 15.000 € salta da 1.955 a ~3.100 €; a 25.000 e 35.000 due gradini da 65 €. A 50.000 **non** c'è discontinuità: la formula tende già a zero.

Fonti: [Brocardi — art. 13 TUIR, testo vigente](https://www.brocardi.it/testo-unico-imposte-redditi/titolo-i/capo-i/art13.html) · [Fiscomania](https://fiscomania.com/detrazioni-per-redditi-da-lavoro-dipendente/)

---

## 4. Cuneo fiscale — L. 207/2024 art. 1, resa strutturale dalla L. 199/2025

La Legge di Bilancio 2025 ha un solo articolo: le due misure stanno ai **commi 4 e 6**.

### 4.A Somma esente (co. 4)

Spetta se il **reddito complessivo ≤ 20.000 €**. La percentuale si applica al **reddito di lavoro dipendente**: due basi concettualmente distinte, che qui coincidono.

| Reddito di lavoro dipendente | Percentuale |
|---|---|
| fino a 8.500 € | 7,1% |
| 8.501 – 15.000 € | 5,3% |
| 15.001 – 20.000 € | 4,8% |

- Massimo **960 €/anno** (20.000 × 4,8%).
- **Non concorre al reddito** IRPEF e **non è soggetta a contribuzione INPS**. Non è una detrazione: si somma al netto, non riduce l'imposta.
- Il reddito complessivo rilevante è al netto dell'abitazione principale e pertinenze.

### 4.B Ulteriore detrazione (co. 6)

| Reddito complessivo | Detrazione |
|---|---|
| 20.000 – 32.000 € | 1.000 € |
| 32.001 – 40.000 € | 1.000 × (40.000 − R) / 8.000 |
| oltre 40.000 € | 0 |

Detrazione dall'imposta lorda, quindi soggetta a capienza. Cumulabile con l'art. 13, con le detrazioni per familiari e con il bonus mamme.

Fonti: [Agenzia Entrate — circolare 4/E del 16/05/2025](https://def.finanze.it/DocTribFrontend/getPrassiDetail.do?id=%7BCEEFD3BC-3B00-42D7-AED1-5AFB7C40827E%7D) · [FiscoeTasse — guida e FAQ](https://www.fiscoetasse.com/new-rassegna-stampa/1178-taglio-cuneo-fiscale-ecco-le-novita-2025.html) · [InformazioneFiscale — bonus cuneo nella CU 2026](https://www.informazionefiscale.it/cu-2026-dipendenti-novita-bonus-cuneo-fiscale-istruzioni)

---

## 5. Addizionali locali

### Regionale — Lombardia

Art. 72 **l.r. 10/2003**, come modificato dalla **l.r. 5/2022**. Per scaglioni, sul reddito complessivo al netto degli oneri deducibili.

| Scaglione | Aliquota |
|---|---|
| fino a 15.000 € | 1,23% |
| 15.001 – 28.000 € | 1,58% |
| 28.001 – 50.000 € | 1,72% |
| oltre 50.000 € | 1,73% |

**Quattro scaglioni regionali contro tre nazionali.** L'art. 1 commi 649-650 della L. 199/2025 proroga al 2028 la facoltà per le Regioni di mantenere i propri scaglioni storici, intervenendo sul co. 728 della L. 207/2024. Le soglie regionali non coincidono con quelle IRPEF: servono due tabelle separate nel motore.

Fonti: [Regione Lombardia](https://www.regione.lombardia.it/bollo-auto-e-tributi-regionali/red-addizionale-regionale-irpef) · [PMI.it — proroga al 2028](https://www.pmi.it/economia/mercati/481567/addizionali-irpef-vecchie-aliquote-fino-al-2028.html)

### Comunale — Milano

Aliquota unica **0,80%**, esenzione fino a **23.000 €** di reddito imponibile. Delibera n. 46 del 28/09/2020, confermata annualmente.

L'esenzione **non è una franchigia**: superata la soglia si paga sull'intero imponibile, non sull'eccedenza. Da qui una discontinuità di ~184 € a 23.001 €.

Fonti: [Comune di Milano](https://www.comune.milano.it/argomenti/tributi/addizionale-comunale-irpef), che dichiara *«esenti i cittadini con reddito imponibile … non superiore a € 23.000,00»* e *«aliquota unica dello 0,8%»* · [MEF — portale del federalismo fiscale](https://www1.finanze.gov.it/finanze2/dipartimentopolitichefiscali/fiscalitalocale/nuova_addcomirpef/risultato.htm?anno=9999&lista=1&pagina=lombardia.htm&cm=&pr=MI&cc=F205&r=1)

---

## 6. Regole di calcolo

1. **I contributi non sono oneri deducibili.** Non concorrono a formare il reddito ex **art. 51 co. 2 lett. a) TUIR**, non sono deduzioni ex art. 10. Il numero è identico, la motivazione no.
   → `reddito complessivo = RAL − contributi`, ed è la base per scaglioni IRPEF, detrazione art. 13, soglie del cuneo e addizionali.

2. **Base delle addizionali** = reddito complessivo al netto degli oneri deducibili (art. 50 D.Lgs. 446/1997). Non è l'imponibile al netto delle detrazioni.

3. **Addizionali dovute solo se l'IRPEF è dovuta**, dopo aver scomputato detrazioni e crediti. Escluse anche per IRPEF netta ≤ 12 € — soglia che sta nella **circolare AdE del 9 gennaio 1998**, non nell'articolo. Serve un controllo di incapienza *prima* del blocco addizionali. [Fonte](https://www.finanze.gov.it/it/fiscalita/fiscalita-regionale-e-locale/Addizionale-regionale-allIRPEF/disciplina-del-tributo/)

4. **Capienza:** `IRPEF netta = max(0, imposta lorda − detrazioni)`. Le detrazioni non generano credito.

---

## 7. Trattamento integrativo

**Vigente nel 2026**, non modificato dalla L. 199/2025. Riferimento: **art. 1 D.L. 3/2020**, conv. L. 21/2020. È **cumulabile** con entrambe le misure del cuneo.

| Reddito complessivo | Spettanza |
|---|---|
| fino a 15.000 € | **1.200 €/anno**, se l'imposta lorda supera la detrazione art. 13 diminuita di 75 € |
| 15.001 – 28.000 € | solo se la somma delle detrazioni (familiari, lavoro dipendente, mutui ante 2021) supera l'imposta lorda; spetta per la differenza, max 1.200 € |
| oltre 28.000 € | non spetta |

È un **credito erogato in busta**, non una detrazione: aumenta il netto anche senza capienza.

### Perimetro effettivo nel modello

Sotto i 18.136,56 € di RAL i contributi sono la costante **1.666,75 €** (9,19% del minimale): la conversione fra imponibile e RAL è una somma, non una divisione.

- Soglia inferiore: `0,23 × R > 1.955 − 75` → R > 8.173,91 € → **RAL > 9.840,66 €**
- Soglia superiore: R ≤ 15.000 → **RAL ≤ 16.666,75 €**

→ **1.200 € piatti per RAL fra 9.840,67 e 16.666,74 €**, zero fuori. Confini verificati per campionamento sul motore.

**Il secondo ramo è irraggiungibile.** Richiede detrazione > imposta lorda: fino a 15.000 € di imponibile la detrazione è la costante 1.955 € e l'imposta lorda cresce al 23%, quindi si eguagliano a **8.500 € esatti**. Sopra restano divergenti (a R = 15.001: 3.450 € contro 3.100 €) e il ramo parte proprio da lì. Va implementato solo il primo.

Fonti: [Fiscomania](https://fiscomania.com/trattamento-integrativo-come-funziona/) · [Studio Mattonai — disciplina vigente 2026](https://www.studiomattonai.it/2026/03/06/trattamento-integrativo-2026-disciplina-vigente-misure-speciali-15-e-detassazioni-su-voci-retributive/)

---

## Appendice — valori NON vigenti, da non usare

Elencati perché circolano ancora e contaminano il confronto con i calcolatori online.

| Trappola | Realtà 2026 |
|---|---|
| 4 scaglioni IRPEF con 25% fra 15.000 e 28.000 | regime 2023 |
| Seconda aliquota IRPEF al 35% | regime 2024–2025, ora 33% |
| Massimale contributivo 119.650 / 120.607 | valori 2024 / 2025, ora 122.295 |
| Prima fascia pensionabile 52.190 / 55.448 | 55.448 è il 2025, ora 56.224 |
| Cuneo come *esonero contributivo* | abolito dal 2025: i contributi restano interi al 9,19% |
| Detrazione art. 13 «+50 € fra 25.001 e 29.000» | non confermato dal testo: è 65 € fra 25.000 e 35.000 |

Diversi calcolatori online ignorano la maggiorazione di 65 €, il trattamento integrativo o la regola di incapienza. In caso di scostamento va indagata la causa, non assunto che l'errore sia nostro.

*Documento riverificato integralmente il 28/08/2026: ogni URL testato, ogni citazione normativa ricontrollata alla fonte.*
