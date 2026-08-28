# Calcolatore RAL → Netto (anno d'imposta 2026)

Data una RAL, calcola il netto annuo e mensile di un lavoratore dipendente e mostra il dettaglio di tutte le voci trattenute sul lordo.

**[Prova il calcolatore](https://yolan00.github.io/calcolatore-ral-netto/)**

Caso modellato: dipendente privato a tempo indeterminato, residente a Milano (Lombardia), nessuna agevolazione particolare.

HTML, CSS e JavaScript vanilla. Nessun framework, nessun build step, nessuna dipendenza.

---

## Il concetto centrale

La trasformazione da RAL a netto non è una percentuale: è una sequenza ordinata in cui **ogni soglia si legge sull'imponibile fiscale, non sulla RAL**.

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

Un errore sull'imponibile si propaga a tutto ciò che sta a valle. Esempio concreto, verificabile nel calcolatore: con **RAL 25.000 €** l'imponibile è **22.702,50 €**, quindi la maggiorazione di 65 € della detrazione — che scatta sopra i 25.000 — **non spetta**. Serve una RAL di circa **27.531 €** perché l'imponibile superi quella soglia.

Le ultime due voci sono additive e non riducono l'imposta: confonderle con delle detrazioni è l'errore concettuale più facile, ed è il motivo per cui in pagina stanno in una sezione separata.

## Come si usa

Il sito è statico e non richiede nulla per essere visitato. Per lavorarci in locale serve un server HTTP: gli ES module sono bloccati dalla *same-origin policy* se la pagina viene aperta da `file://`.

```bash
python -m http.server 8000
```

```bash
npm test
```

I test usano il runner integrato di Node (`node --test`), senza dipendenze esterne. Serve Node 18 o superiore.

## Struttura

| File | Responsabilità |
|---|---|
| `parametri-2026.js` | I valori fiscali e le loro fonti. Nient'altro. |
| `calcolo.js` | Il motore. Funzioni pure, nessun riferimento al DOM. |
| `formato.js` | Traduzione fra numeri e testo italiano. Nessun DOM. |
| `app.js` | Solo DOM: legge il form, chiama il motore, popola la pagina. |
| `test.js` | 17 test eseguibili con `node --test`. |
| `Dati e fonti/` | Il documento di ricerca e il verbale di validazione esterna. |

**Regola architetturale:** `calcolo.js` non contiene alcun riferimento al DOM e `app.js` non contiene alcuna aritmetica. Quando il breakdown ha richiesto l'incidenza percentuale di ogni voce sulla RAL — cioè una divisione — la funzione `incidenzaSuRal()` è stata aggiunta al motore invece di scrivere l'operazione nel collante. La regola vale la pena proprio quando è scomoda.

I parametri arrivano al motore **come argomento**, non tramite import: `calcolaNetto(ral, parametri)`. È ciò che rende i test indipendenti dai valori reali e il cambio d'anno una sostituzione di file. Un test lo verifica alterando un'aliquota nell'oggetto passato e controllando che il risultato segua.

**Nessun arrotondamento intermedio.** Tutti i calcoli avvengono in virgola mobile piena; l'arrotondamento accade solo in `formato.js`, in fase di visualizzazione. Arrotondare a ogni passaggio accumula scarti e rende impossibile il confronto con i riferimenti esterni.

## Parametri e fonti

Verifica puntuale, con i riferimenti normativi estesi, in **[`Dati e fonti/parametri-fiscali-2026.md`](Dati%20e%20fonti/parametri-fiscali-2026.md)**. Tutti i valori verificati il 28/08/2026.

| Parametro | Valore 2026 | Fonte |
|---|---|---|
| Scaglioni IRPEF | 23% fino a 28.000 · 33% fino a 50.000 · 43% oltre | [Art. 11 TUIR, L. 199/2025](https://www.mef.gov.it/focus/Principali-misure-della-legge-di-bilancio-2026/) |
| Aliquota INPS lavoratore | 9,19% | [Circolare INPS 6/2026](https://www.inps.it/it/it/inps-comunica/notizie/dettaglio-news-page.news.2026.02.lavoratori-dipendenti-limite-minimo-di-retribuzione-giornaliera-2026.html) |
| Aliquota aggiuntiva 1% | oltre 56.224 € | Art. 3-ter D.L. 384/1992 |
| Massimale contributivo | 122.295 € | Circolare INPS 6/2026 |
| Minimale giornaliero | 58,13 € (× 312 gg = 18.136,56 €) | Circolare INPS 6/2026 |
| Detrazione lavoro dipendente | 1.955 € → 0 oltre 50.000 €, +65 € fra 25.000 e 35.000 | [Art. 13 TUIR](https://www.brocardi.it/testo-unico-imposte-redditi/titolo-i/capo-i/art13.html) |
| Somma esente (cuneo) | 7,1% · 5,3% · 4,8% fino a 20.000 €, max 960 € | [L. 207/2024, circ. AdE 4/E 2025](https://www.fiscoetasse.com/new-rassegna-stampa/1178-taglio-cuneo-fiscale-ecco-le-novita-2025.html) |
| Ulteriore detrazione (cuneo) | 1.000 € fra 20.000 e 32.000, azzerata a 40.000 | L. 207/2024 |
| Trattamento integrativo | 1.200 € fino a 15.000 € di imponibile | [Art. 1 D.L. 3/2020](https://fiscomania.com/trattamento-integrativo-come-funziona/) |
| Addizionale regionale | Lombardia, 1,23% · 1,58% · 1,72% · 1,73% a scaglioni | [Art. 72 l.r. 10/2003](https://www.regione.lombardia.it/bollo-auto-e-tributi-regionali/red-addizionale-regionale-irpef) |
| Addizionale comunale | Milano, 0,8% con esenzione fino a 23.000 € | [Delibera 46/2020, portale MEF](https://www1.finanze.gov.it/finanze2/dipartimentopolitichefiscali/fiscalitalocale/nuova_addcomirpef/risultato.htm?anno=9999&lista=1&pagina=lombardia.htm&cm=&pr=MI&cc=F205&r=1) |
| Soglia di incapienza addizionali | IRPEF netta > 12 € | [Art. 50 D.Lgs. 446/1997](https://www.finanze.gov.it/it/fiscalita/fiscalita-regionale-e-locale/Addizionale-regionale-allIRPEF/disciplina-del-tributo/) |

Attenzione alle fonti obsolete: molte guide online riportano ancora quattro scaglioni con il 25%, o la seconda aliquota al 35%, o il taglio del cuneo come esonero contributivo. Sono regimi superati. L'elenco delle trappole note è in appendice al documento di ricerca.

## Il netto non è monotono

All'aumentare del lordo il netto **scende**, in tre punti. Non sono bug: sono soglie secche volute dal legislatore, e il calcolatore le riproduce invece di appianarle. Tutte e tre sono congelate in test che ne verificano l'entità esatta.

**A 10.166,75 € di RAL — caduta di 151,99 €.** Superati gli 8.500 € di imponibile, l'aliquota della somma esente scende dal 7,1% al 5,3%. Non è progressiva: la nuova aliquota si applica all'intero reddito, non alla sola eccedenza.

| RAL | Netto annuo |
|---|---|
| 10.166 € | 10.302,70 € |
| 10.167 € | 10.150,71 € |

**A 16.666,75 € di RAL — caduta di 52,26 €.** Superati i 15.000 € di imponibile agiscono insieme tre norme diverse, in direzioni opposte: il trattamento integrativo si azzera (−1.200 €), l'aliquota della somma esente scende dal 5,3% al 4,8% (−70 €), la detrazione art. 13 salta da 1.955 a ~3.100 € (+1.145 €). Nessuna delle tre da sola spiega il risultato.

| RAL | Netto annuo |
|---|---|
| 16.600 € | 15.261,39 € |
| 16.700 € | 15.209,13 € |

**A ~25.327 € di RAL — caduta di 183,40 €.** L'esenzione dell'addizionale comunale di Milano è una soglia secca, non una franchigia: superati i 23.000 € di imponibile si paga lo 0,8% sull'intero importo, non sull'eccedenza.

## Semplificazioni adottate

Dalla consegna: tempo indeterminato, residenza a Milano, nessuna agevolazione particolare.

| Semplificazione | Perché |
|---|---|
| Aliquota INPS al 9,19% | Vale per aziende fino a 15 dipendenti. Sopra tale soglia sale a 9,49% per lo 0,30% destinato al FIS. Esporre la dimensione aziendale avrebbe aggiunto un input senza cambiare la struttura del calcolo. |
| Rapporto per l'intero anno (365 giorni) | Le detrazioni non vengono ridotte pro rata. Il part-time e i rapporti parziali richiederebbero di riproporzionare anche il minimale contributivo. |
| 312 giorni retribuiti per il minimale | 26 × 12: convenzione standard per un anno pieno. È un'assunzione del modello, non un dato della circolare INPS. |
| Iscritti INPS dopo il 31/12/1995 | Il massimale di 122.295 € si applica solo a loro. Per gli iscritti precedenti non esiste massimale, e sopra tale RAL il netto sarebbe inferiore. |
| Nessun familiare a carico | Le detrazioni art. 12 TUIR sono un albero decisionale a sé, estraneo al punto dell'esercizio. |
| Nessun onere deducibile o detraibile | Oltre a quelli automatici. |
| Niente fondo pensione, fringe benefit, premi di risultato, straordinari, bonus | Sono voci contrattuali e individuali, non derivabili dalla RAL. |
| TFR non incluso nel netto | Matura ma non viene erogato in busta. |
| 13ª e 14ª trattate come le altre mensilità | Nella realtà la tredicesima è tassata senza le detrazioni mensili, quindi il netto della singola mensilità differisce. Il totale annuo resta corretto. |
| Addizionali per competenza sull'anno in corso | Nella realtà si versano l'anno successivo in rate. |
| 14 mensilità come default | CCNL Terziario, distribuzione e servizi. Il selettore consente 12, 13 o 14. |

## Limiti noti

- **Secondo ramo del trattamento integrativo non implementato.** La norma prevede una spettanza parziale fra 15.001 e 28.000 € quando le detrazioni superano l'imposta lorda. Sotto le assunzioni di questo modello la condizione non si verifica mai: le due curve si incrociano a un imponibile di ~13.911 €, cioè *sotto* il limite di fascia, e da lì in poi l'imposta lorda resta stabilmente superiore. Il ramo diventa raggiungibile solo introducendo familiari a carico o mutui ante 2021. Non è codice mancante: è codice dimostrabilmente irraggiungibile.
- **Minimo garantito della detrazione (690 €, 1.380 € a tempo determinato) non implementato.** Rileva solo per rapporti di durata inferiore all'anno.
- **Clausola di sterilizzazione oltre 200.000 € non modellata.** La L. 199/2025 riduce di 440 € le detrazioni per oneri al 19% sopra tale reddito. Il modello non prevede oneri detraibili, quindi la clausola non ha su cosa agire.
- **RAL troppo basse vengono rifiutate.** Se i contributi dovuti sul minimale superano la retribuzione, l'imponibile sarebbe negativo. Il calcolatore rifiuta con una spiegazione invece di restituire uno zero plausibile e falso.
- **Il minimale contributivo è applicato su base annua.** Nella realtà il confronto con il minimale avviene mese per mese: con retribuzione irregolare i due metodi divergono. Per una retribuzione costante — l'unico caso che il modello rappresenta — coincidono.
- **L'imponibile fiscale non viene arrotondato all'euro.** In busta paga e in dichiarazione l'arrotondamento all'unità precede l'applicazione degli scaglioni. Qui si calcola in virgola mobile piena per non accumulare scarti, il che è più preciso ma diverge dal procedimento reale di pochi centesimi.
- **Nessun confronto con una busta paga reale.** La validazione è avvenuta contro altri modelli, non contro documenti amministrativi.
- **Un difetto del codice verrebbe mostrato come se fosse un errore di input.** La pagina intercetta ogni eccezione e ne stampa il messaggio: distinguere gli errori di validazione da quelli imprevisti richiederebbe un tipo d'errore dedicato, sproporzionato rispetto al rischio su una base di codice di questa dimensione.
- **Al trattamento integrativo viene passata la detrazione art. 13 comprensiva della maggiorazione di 65 €.** La norma richiama la detrazione del solo comma 1. Oggi è indifferente, perché le due misure non si sovrappongono mai: il trattamento integrativo si ferma a 15.000 € di imponibile e la maggiorazione parte da 25.000 €.

## Verifica

**19 test** eseguibili con `node --test`. Gli attesi sono calcolati a mano a partire dalla norma, non copiati dall'output del motore: un test che confronta il codice con se stesso certifica solo che il codice fa quello che fa.

Oltre ai casi numerici, la suite verifica alcune **proprietà**:

- somma esente e ulteriore detrazione non risultano mai attive contemporaneamente;
- nessun valore non finito o negativo su tutto il dominio ammesso, campionato ogni 250 € fino a 200.000 €;
- alterando un'aliquota nell'oggetto dei parametri il risultato cambia di conseguenza, prova che il motore non contiene valori cablati;
- i divisori delle formule (13.000, 22.000) coincidono con le ampiezze delle fasce da cui derivano.

**Validazione esterna** in [`Dati e fonti/validazione-esterna.md`](Dati%20e%20fonti/validazione-esterna.md): coincidenza al centesimo su ogni voce con un calcolatore pubblico aggiornato alla L. 199/2025, e decomposizione completa degli scostamenti con gli altri riferimenti.

## Aggiornare all'anno d'imposta successivo

La struttura è pensata perché l'aggiornamento tocchi un file solo.

1. Copiare `parametri-2026.js` in `parametri-2027.js` e aggiornare i valori, verificandoli alla fonte e annotando `dataVerifica`.
2. Cambiare l'import in `app.js` e in `test.js`. Nient'altro in `calcolo.js` va toccato: se servisse, significa che una norma ha cambiato *struttura* e non solo valori.
3. Eseguire `npm test`. Il test di coerenza interna segnala subito se i divisori delle formule non corrispondono più ai limiti di fascia.
4. Ricalcolare a mano gli attesi dei casi numerici. È il passaggio più lento ed è deliberatamente così: sono la prova documentale che i nuovi valori sono stati verificati e non solo trascritti.

Punti da ricontrollare ogni anno, perché cambiano più spesso degli altri: massimale e minimale INPS, prima fascia di retribuzione pensionabile, soglia di esenzione dell'addizionale comunale, e se le Regioni mantengano i propri scaglioni storici — la facoltà è prorogata fino al 2028.
