// Lettura e scrittura dei numeri secondo la convenzione italiana. Nessun DOM:
// e' in un modulo a parte perche' leggiImporto sia testabile.

// Gli esempi compaiono sia nel suggerimento sotto il campo sia nel messaggio
// d'errore: definiti una volta sola perche' non possano divergere.
export const ESEMPI_FORMATO = '35000 · 35.000 · 1.234,56';
export const AIUTO_FORMATO = `Usa solo cifre, con la virgola per i decimali. Esempi: ${ESEMPI_FORMATO}`;

// useGrouping esplicito: di default l'italiano usa il raggruppamento "min2" e non
// separa le migliaia sotto i 10.000, dando "3216,50 €" accanto a "26.032,22 €".
export const euro = (n) =>
  n.toLocaleString('it-IT', { style: 'currency', currency: 'EUR', useGrouping: 'always' });

export const percento = (n, decimali = 1) =>
  n.toLocaleString('it-IT', {
    style: 'percent',
    minimumFractionDigits: decimali,
    maximumFractionDigits: decimali
  });

// Ogni forma e' riconosciuta prima di essere normalizzata. Ripulire la stringa
// senza validarla accetterebbe "1,2.3" leggendolo come 1,23: plausibile e falso.
const GRUPPI = /^-?\d{1,3}(\.\d{3})+(,\d+)?$/;   // 35.000   1.234.567   1.234,56
const VIRGOLA = /^-?\d+(,\d+)?$/;                // 35000    35000,50
const PUNTO = /^-?\d+\.\d{1,2}$/;                // 35000.50 (copiato da locale inglese)

export function leggiImporto(testo) {
  const pulito = String(testo).replace(/\s/g, '');
  if (pulito === '') {
    throw new RangeError('Inserisci la RAL.');
  }

  // Convenzione italiana: la virgola separa i decimali, il punto le migliaia.
  if (GRUPPI.test(pulito)) return Number(pulito.replace(/\./g, '').replace(',', '.'));
  if (VIRGOLA.test(pulito)) return Number(pulito.replace(',', '.'));
  if (PUNTO.test(pulito)) return Number(pulito);

  throw new TypeError(`«${String(testo).trim()}» non è un importo valido. ${AIUTO_FORMATO}`);
}
