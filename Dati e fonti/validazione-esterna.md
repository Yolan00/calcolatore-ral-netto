# Validazione contro riferimenti esterni

28/08/2026. Assunzioni allineate ove il calcolatore esterno lo consentiva: Lombardia, addizionale comunale 0,8%, aliquota INPS 9,19%, tempo indeterminato, anno pieno, nessun familiare a carico.

**Criterio:** uno scostamento non è automaticamente un errore nostro, ma va spiegato fino all'ultimo centesimo. Uno scostamento non spiegato è un errore nostro fino a prova contraria.

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

Il calcolatore è aggiornato alla L. 199/2025, applica il 33%, include la maggiorazione di 65 € e distingue imponibile e RAL. È il riferimento più solido trovato.

## B. stipendionettocalcolatore.it — RAL 15.000

Scostamento di **124,71 €** (nostro 13.964,27, esterno 14.088,98), interamente decomposto:

| Causa | Effetto sul netto |
|---|---|
| Non applicano il **minimale contributivo**: INPS sulla RAL (1.378,50) invece che sul minimale (1.666,75) | **+288,25** |
| Il loro imponibile più alto genera più IRPEF (+66,30) e più addizionale regionale (+3,55) | **−69,84** |
| Non modellano la **soglia di esenzione di Milano**: applicano lo 0,8% anche sotto i 23.000 € | **−108,97** |
| Somma esente calcolata su base più alta | **+15,28** |
| **Totale** | **+124,71** |

Su entrambe le differenze metodologiche riteniamo corretto il nostro modello — minimale contributivo (circolare INPS 6/2026) ed esenzione Milano (delibera 46/2020) — e in entrambi i casi il loro form non espone il parametro, quindi non era allineabile.

## C. tuttocalcolo.it — RAL 35.000, 14 mensilità

Scostamento di **1.467,22 €** (nostro 26.032,22, esterno 24.565). Quattro errori identificati:

| Problema | Evidenza |
|---|---|
| Aliquota al **35%** anziché 33% | IRPEF lorda 7.764 = 6.440 + 3.783 × **0,35**; la loro FAQ dichiara «23%/35%/43% nel 2024-2025» |
| **Ignora il cuneo fiscale** | Nessuna ulteriore detrazione da 1.000 € nel riepilogo |
| Addizionale regionale come **aliquota piatta** 1,58% invece che per scaglioni | 756 = 31.783 × (1,58% + 0,8%); il valore corretto è 709,25 |
| Detrazione art. 13 errata | Mostra 1.302 contro i 1.581,52 della formula di legge, prima della maggiorazione |

Stessi quattro problemi sul default del sito (RAL 30.000), con scostamento di 1.360 €.

---

**Limite.** Nessun confronto con una busta paga reale: tutti i riferimenti sono a loro volta modelli. La coincidenza con A prova che due implementazioni indipendenti della stessa norma convergono, non che entrambe l'abbiano interpretata correttamente.
