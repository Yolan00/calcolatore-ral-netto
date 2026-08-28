# Calcolatore RAL → Netto (anno d'imposta 2026)

Data una RAL, calcola il netto annuo e mensile di un lavoratore dipendente e mostra il dettaglio di tutte le voci trattenute sul lordo.

**[Prova il calcolatore](https://yolan00.github.io/calcolatore-ral-netto/)**

Caso modellato: dipendente privato a tempo indeterminato, residente a Milano (Lombardia), nessuna agevolazione particolare. HTML, CSS e JavaScript vanilla: nessun framework, nessun build step, nessuna dipendenza.

## La catena di calcolo

**Ogni soglia si legge sull'imponibile fiscale, non sulla RAL.**

```
RAL
  → base contributiva = RAL limitata fra minimale e massimale
  − contributi INPS a carico del lavoratore (9,19% + 1% sull'eccedenza)
  = imponibile fiscale                        ← NON è la RAL
  → IRPEF lorda (23% · 33% · 43%)
  − detrazione per lavoro dipendente (art. 13 TUIR)
  − ulteriore detrazione — cuneo fiscale
  = IRPEF netta                               ← non può essere negativa
  − addizionale regionale (Lombardia, a scaglioni)   ⎫ dovute solo se
  − addizionale comunale (Milano, soglia secca)      ⎭ IRPEF netta > 12 €
  + somma esente — cuneo fiscale              ← non concorre al reddito
  + trattamento integrativo                   ← credito, non detrazione
  = netto annuo ÷ mensilità
```

Con RAL 25.000 € l'imponibile è 22.702,50 €: la maggiorazione di 65 €, che scatta sopra i 25.000, **non spetta**. Serve una RAL di ~27.531 €.

Le ultime due voci sono additive e non riducono l'imposta: per questo in pagina stanno in una sezione separata.

## Come si usa

Il sito è statico. In locale serve un server HTTP, perché gli ES module sono bloccati da `file://`:

```bash
python -m http.server 8000
```

```bash
npm test
```

**Serve Node 20 o superiore:** `useGrouping: 'always'` fa parte di Intl.NumberFormat v3, disponibile da Node 19. Su versioni precedenti non fallisce, formatta diversamente.

## Struttura

| File | Responsabilità |
|---|---|
| `parametri-2026.js` | Valori fiscali e loro fonti. Nient'altro. |
| `calcolo.js` | Motore. Funzioni pure, nessun riferimento al DOM. |
| `formato.js` | Traduzione fra numeri e testo italiano. Nessun DOM. |
| `app.js` | Solo DOM: legge il form, chiama il motore, popola la pagina. |
| `test.js` | 19 test eseguibili con `node --test`. |
| `Dati e fonti/` | Documento di ricerca e verbale di validazione esterna. |

Tre regole:

- `calcolo.js` non tocca il DOM, `app.js` non contiene aritmetica. L'incidenza percentuale di ogni voce sulla RAL è una divisione, quindi sta nel motore (`incidenzaSuRal`).
- I parametri arrivano al motore **come argomento**: `calcolaNetto(ral, parametri)`. Un test lo verifica alterando un'aliquota e controllando che il risultato segua.
- **Nessun arrotondamento intermedio.** Si arrotonda solo in `formato.js`, alla visualizzazione.

## Parametri e fonti

Verifica puntuale in **[`Dati e fonti/parametri-fiscali-2026.md`](Dati%20e%20fonti/parametri-fiscali-2026.md)**. Tutti i valori verificati il 28/08/2026.

| Parametro | Valore 2026 | Fonte |
|---|---|---|
| Scaglioni IRPEF | 23% fino a 28.000 · 33% fino a 50.000 · 43% oltre | [Art. 11 TUIR, L. 199/2025](https://www.mef.gov.it/focus/Principali-misure-della-legge-di-bilancio-2026/) |
| Aliquota INPS lavoratore | 9,19% | [Circolare INPS 6/2026](https://www.inps.it/it/it/inps-comunica/notizie/dettaglio-news-page.news.2026.02.lavoratori-dipendenti-limite-minimo-di-retribuzione-giornaliera-2026.html) |
| Aliquota aggiuntiva 1% | oltre 56.224 € | Art. 3-ter D.L. 384/1992, conv. L. 438/1992 |
| Massimale contributivo | 122.295 € | Circolare INPS 6/2026 |
| Minimale giornaliero | 58,13 € (× 312 gg = 18.136,56 €) | Circolare INPS 6/2026 |
| Detrazione lavoro dipendente | 1.955 € → 0 oltre 50.000 €, +65 € fra 25.000 e 35.000 | [Art. 13 TUIR, co. 1 e 1.1](https://www.brocardi.it/testo-unico-imposte-redditi/titolo-i/capo-i/art13.html) |
| Somma esente (cuneo) | 7,1% · 5,3% · 4,8% fino a 20.000 €, max 960 € | [L. 207/2024 art. 1 co. 4; circ. AdE 4/E 2025](https://def.finanze.it/DocTribFrontend/getPrassiDetail.do?id=%7BCEEFD3BC-3B00-42D7-AED1-5AFB7C40827E%7D) |
| Ulteriore detrazione (cuneo) | 1.000 € fra 20.000 e 32.000, azzerata a 40.000 | L. 207/2024 art. 1 co. 6 |
| Trattamento integrativo | 1.200 € fino a 15.000 € di imponibile | [Art. 1 D.L. 3/2020](https://fiscomania.com/trattamento-integrativo-come-funziona/) |
| Addizionale regionale | Lombardia, 1,23% · 1,58% · 1,72% · 1,73% a scaglioni | [Art. 72 l.r. 10/2003](https://www.regione.lombardia.it/bollo-auto-e-tributi-regionali/red-addizionale-regionale-irpef) |
| Addizionale comunale | Milano, 0,8% con esenzione fino a 23.000 € | [Comune di Milano, delibera 46/2020](https://www.comune.milano.it/argomenti/tributi/addizionale-comunale-irpef) |
| Soglia di incapienza | IRPEF netta > 12 € | [Art. 50 D.Lgs. 446/1997](https://www.finanze.gov.it/it/fiscalita/fiscalita-regionale-e-locale/Addizionale-regionale-allIRPEF/disciplina-del-tributo/); soglia da circ. AdE 09/01/1998 |

Molte guide online riportano ancora quattro scaglioni con il 25%, la seconda aliquota al 35% o il cuneo come esonero contributivo: sono regimi superati. Elenco completo delle trappole in appendice al documento di ricerca.

## Il netto non è monotono

All'aumentare del lordo il netto **scende**, in tre punti. Sono soglie secche volute dal legislatore: il calcolatore le riproduce invece di appianarle, e un test congela l'entità di ciascun salto.

| Soglia | Netto prima | Netto dopo | Caduta | Causa |
|---|---|---|---|---|
| RAL 10.166,75 € | 10.302,70 € | 10.150,71 € | **−151,99 €** | L'aliquota della somma esente scende dal 7,1% al 5,3% e si applica all'intero reddito, non all'eccedenza |
| RAL 16.666,75 € | 15.261,39 € | 15.209,13 € | **−52,26 €** | Tre norme insieme: il trattamento integrativo si azzera (−1.200), la somma esente scende al 4,8% (−70), la detrazione art. 13 salta a ~3.100 (+1.145) |
| RAL 25.327 € | 20.766,43 € | 20.583,03 € | **−183,40 €** | L'esenzione comunale di Milano è una soglia secca: sopra i 23.000 € di imponibile si paga lo 0,8% sull'intero importo |

## Semplificazioni adottate

Dalla consegna: tempo indeterminato, residenza a Milano, nessuna agevolazione.

| Semplificazione | Perché |
|---|---|
| Aliquota INPS al 9,19% | Vale fino a 15 dipendenti; sopra sale a 9,49% per lo 0,30% al FIS. Esporre la dimensione aziendale non cambierebbe la struttura del calcolo. |
| Rapporto per l'intero anno | Detrazioni non ridotte pro rata. Il part-time richiederebbe di riproporzionare anche il minimale contributivo. |
| 312 giorni retribuiti | 26 × 12, convenzione standard. È un'assunzione del modello, non un dato della circolare INPS. |
| Iscritti INPS dopo il 31/12/1995 | Solo per loro vale il massimale. Per gli iscritti precedenti non esiste, e sopra tale RAL il netto sarebbe inferiore. |
| Nessun familiare a carico | Le detrazioni art. 12 TUIR sono un albero decisionale a sé. |
| Nessun onere deducibile o detraibile | Oltre a quelli automatici. |
| Niente fondo pensione, fringe benefit, premi, straordinari | Voci contrattuali e individuali, non derivabili dalla RAL. |
| TFR escluso | Matura ma non viene erogato in busta. |
| 13ª e 14ª come le altre mensilità | Nella realtà la tredicesima è tassata senza le detrazioni mensili: la singola busta differisce, il totale annuo no. |
| Addizionali per competenza | Nella realtà si versano l'anno successivo, a rate. |
| 14 mensilità di default | CCNL Terziario. Il selettore consente 12, 13 o 14. |

## Limiti noti

- **Secondo ramo del trattamento integrativo non implementato.** Spetterebbe fra 15.001 e 28.000 € se le detrazioni superassero l'imposta lorda. Le due si eguagliano a **8.500 € esatti** (`0,23 × 8.500 = 1.955`) e sopra restano divergenti: il ramo è irraggiungibile senza familiari a carico o mutui ante 2021.
- **Minimo garantito della detrazione** (690 €, 1.380 € a tempo determinato): rileva solo sotto l'anno.
- **Clausola oltre 200.000 €**: riduce di 440 € le detrazioni per oneri al 19%, che il modello non prevede.
- **RAL troppo basse rifiutate**: se i contributi sul minimale superano la retribuzione l'imponibile sarebbe negativo, e il calcolatore rifiuta invece di restituire uno zero falso.
- **Minimale su base annua**: nella realtà il confronto è mensile. Coincidono solo con retribuzione costante.
- **Imponibile non arrotondato all'euro**: in busta paga l'arrotondamento precede gli scaglioni. Divergenza di pochi centesimi.
- **Validazione contro altri modelli**, non contro una busta paga reale.
- **Un difetto del codice apparirebbe come errore di input**: distinguerli richiederebbe un tipo d'errore dedicato, sproporzionato per questa dimensione.
- **Al trattamento integrativo è passata la detrazione con la maggiorazione di 65 €**, mentre la norma richiama il solo comma 1. Indifferente: le due misure non si sovrappongono mai.

## Verifica

**19 test** con `node --test`. Gli attesi sono calcolati a mano dalla norma, non copiati dall'output del motore.

Oltre ai casi numerici la suite verifica quattro proprietà: somma esente e ulteriore detrazione mai attive insieme; nessun valore non finito o negativo su tutto il dominio, campionato ogni 250 € fino a 200.000 €; alterando un'aliquota nei parametri il risultato segue, prova che il motore non ha valori cablati; i divisori delle formule coincidono con le ampiezze delle fasce.

**Validazione esterna** in [`Dati e fonti/validazione-esterna.md`](Dati%20e%20fonti/validazione-esterna.md): coincidenza al centesimo con un calcolatore pubblico aggiornato alla L. 199/2025, e scostamenti decomposti con gli altri riferimenti.

## Aggiornare all'anno successivo

1. Copiare `parametri-2026.js` in `parametri-2027.js`, aggiornare i valori alla fonte e annotare `dataVerifica`.
2. Cambiare l'import in `app.js` e `test.js`. Se servisse toccare `calcolo.js`, significa che una norma ha cambiato struttura e non solo valori.
3. `npm test`. Il test di coerenza segnala se i divisori non corrispondono più ai limiti di fascia.
4. Ricalcolare a mano gli attesi dei casi numerici: è la prova che i nuovi valori sono stati verificati, non solo trascritti.

Cambiano più spesso degli altri: massimale e minimale INPS, prima fascia pensionabile, soglia di esenzione comunale, e se le Regioni mantengano i propri scaglioni — l'art. 1 co. 649-650 della L. 199/2025 proroga tale facoltà fino al 2028, ed è il motivo per cui la Lombardia ne ha quattro contro i tre nazionali.
