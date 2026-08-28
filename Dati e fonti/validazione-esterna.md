# Validazione contro riferimenti esterni

Data: 28/08/2026. Motore alla revisione `332c066`.
Assunzioni allineate ove il calcolatore esterno lo consentiva: Lombardia, addizionale comunale 0,8%, aliquota INPS 9,19%, contratto a tempo indeterminato, anno pieno, nessun familiare a carico.

**Criterio adottato:** uno scostamento non è automaticamente un errore nostro, ma va spiegato fino all'ultimo centesimo. Uno scostamento non spiegato è un errore nostro fino a prova contraria.

---

## A. stipendionettocalcolatore.it — RAL 35.000, 14 mensilità

Coincidenza esatta su ogni voce della catena.

| Voce | Nostro | Esterno |
|---|---|---|
| Contributi INPS | 3.216,50 | 3.216,50 |
| Imponibile fiscale | 31.783,50 | 31.783,50 |
| IRPEF lorda | 7.688,56 | 7.688,56 |
| Detrazione art. 13 (con maggiorazione 65 €) | 1.646,52 | 1.646,52 |
| Ulteriore detrazione cuneo | 1.000,00 | 1.000,00 |
| Addizionali regionale + comunale | 709,25 | 709,24 |
| **Netto annuo** | **26.032,22** | **26.032,22** |
| **Netto mensile** | **1.859,44** | **1.859,44** |

Il calcolatore è dichiaratamente aggiornato alla L. 199/2025, applica il 33%, include la maggiorazione di 65 € e distingue correttamente imponibile e RAL. È il riferimento più solido trovato.

## B. stipendionettocalcolatore.it — RAL 15.000

Scostamento di **124,71 €** (nostro 13.964,27, esterno 14.088,98), interamente decomposto:

| Causa | Effetto sul netto |
|---|---|
| Non applicano il **minimale contributivo**: trattengono INPS sulla RAL (1.378,50) invece che sul minimale (1.666,75) | **+288,25** |
| Il loro imponibile più alto genera più IRPEF (+66,30) e più addizionale regionale (+3,55) | **−69,84** |
| Non modellano la **soglia di esenzione comunale di Milano**: applicano lo 0,8% anche sotto i 23.000 € | **−108,97** |
| Somma esente calcolata su una base più alta | **+15,28** |
| **Totale** | **+124,71** |

Due differenze metodologiche, su entrambe riteniamo corretto il nostro modello:

1. **Minimale contributivo** (58,13 €/giorno × 312, circolare INPS 6/2026). L'imponibile contributivo non può scendere sotto il minimale. Il loro form non espone il parametro, quindi non è un'opzione che potessimo allineare.
2. **Esenzione Milano fino a 23.000 €** (delibera n. 46/2020). Il loro form accetta solo un'aliquota comunale piatta, senza campo per la soglia di esenzione: non possono modellarla.

## C. tuttocalcolo.it — RAL 35.000, 14 mensilità

Scostamento di **1.467,22 €** (nostro 26.032,22, esterno 24.565). Quattro errori identificati:

| Problema | Evidenza |
|---|---|
| Usa l'aliquota del **35%** anziché il 33% | IRPEF lorda 7.764 = 6.440 + 3.783 × **0,35**. La loro FAQ dichiara "23%/35%/43% nel 2024-2025" |
| **Ignora del tutto il cuneo fiscale** | Nessuna ulteriore detrazione da 1.000 € nel riepilogo |
| Applica l'addizionale regionale come **aliquota piatta** 1,58% invece che per scaglioni | 756 = 31.783 × (1,58% + 0,8%); il valore corretto per scaglioni è 709,25 |
| Detrazione art. 13 errata | Mostra 1.302 contro i 1.581,52 della formula di legge, prima della maggiorazione |

Verificato anche sul default del sito (RAL 30.000): stessi quattro problemi, scostamento di 1.360 €.

---

## Esito delle previsioni fatte prima del confronto

| Previsione | Esito |
|---|---|
| I calcolatori useranno ancora il 35% | **Metà.** Sbagliata su A (aggiornato al 33%), esatta su C |
| Ignoreranno maggiorazione 65 € e trattamento integrativo | **Sbagliata su A**, che li implementa entrambi. Esatta su C |
| Non applicheranno il minimale contributivo | **Esatta.** Nessuno dei due lo fa |
| Sbaglieranno la base delle addizionali | **Esatta nella sostanza, non nel meccanismo.** A ignora la soglia di esenzione, C usa un'aliquota piatta invece degli scaglioni |

Due previsioni su quattro erano sbagliate, ed è il risultato più utile del confronto: esiste almeno un calcolatore pubblico aggiornato e corretto, e coincide con il nostro alla virgola su un caso pulito. La coincidenza su A è la conferma più forte disponibile senza una busta paga reale.

## Limite di questa validazione

Nessun confronto con una busta paga reale. Tutti i riferimenti usati sono a loro volta modelli, non documenti amministrativi: la coincidenza con A prova che due implementazioni indipendenti della stessa norma convergono, non che la norma sia stata interpretata correttamente da entrambe.
