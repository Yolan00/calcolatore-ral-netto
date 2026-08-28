// Verifica del motore di calcolo. Eseguire con: node --test
//
// Tutti i valori attesi sono calcolati a mano a partire dalla norma, non copiati
// dall'output del motore: un test che confronta il codice con se stesso certifica
// soltanto che il codice fa quello che fa.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PARAMETRI_2026 as P } from './parametri-2026.js';
import { calcolaNetto, imposteAScaglioni, RAL_MASSIMA } from './calcolo.js';
import { leggiImporto } from './formato.js';

// Un centesimo: gli attesi sono scritti con due decimali, il motore lavora in
// virgola mobile piena e non arrotonda mai prima della visualizzazione.
const vicino = (ottenuto, atteso, voce) =>
  assert.ok(
    Math.abs(ottenuto - atteso) < 0.01,
    `${voce}: atteso ${atteso}, ottenuto ${ottenuto.toFixed(4)}`
  );

test('scaglioni progressivi: ogni fascia tassa solo la parte eccedente', () => {
  // 28.000 x 23% + 7.000 x 33%
  vicino(imposteAScaglioni(35000, P.irpef.scaglioni), 8750, 'IRPEF su 35.000');
  assert.equal(imposteAScaglioni(0, P.irpef.scaglioni), 0, 'reddito nullo');
});

test('RAL 35.000: catena completa', () => {
  const r = calcolaNetto(35000, P);
  vicino(r.contributi.totale, 3216.50, 'contributi');
  vicino(r.redditoComplessivo, 31783.50, 'imponibile fiscale');
  vicino(r.irpefLorda, 7688.56, 'IRPEF lorda');
  vicino(r.detrazione, 1646.52, 'detrazione art. 13 con maggiorazione');
  vicino(r.detrazioneCuneo, 1000, 'ulteriore detrazione cuneo');
  vicino(r.irpefNetta, 5042.03, 'IRPEF netta');
  vicino(r.addizionali.regionale, 454.98, 'addizionale regionale');
  vicino(r.addizionali.comunale, 254.27, 'addizionale comunale');
  vicino(r.nettoAnnuo, 26032.22, 'netto annuo');
  vicino(r.nettoMensile, 26032.22 / 14, 'netto mensile su 14 mensilita');
});

test('RAL 60.000: terzo scaglione e aliquota aggiuntiva 1%', () => {
  const r = calcolaNetto(60000, P);
  // (60.000 - 56.224) x 1%
  vicino(r.contributi.aggiuntivo, 37.76, 'aliquota aggiuntiva');
  vicino(r.redditoComplessivo, 54448.24, 'imponibile fiscale');
  vicino(r.irpefLorda, 15612.74, 'IRPEF lorda');
  assert.equal(r.detrazione, 0, 'nessuna detrazione oltre 50.000');
  vicino(r.nettoAnnuo, 37554.66, 'netto annuo');
});

test('RAL 130.000: la base contributiva si ferma al massimale', () => {
  const r = calcolaNetto(130000, P);
  assert.equal(r.contributi.imponibile, P.contributi.massimale, 'imponibile contributivo');
  vicino(r.contributi.totale, 11899.62, 'contributi');
  vicino(r.redditoComplessivo, 118100.38, 'imponibile fiscale');
  vicino(r.nettoAnnuo, 72225.98, 'netto annuo');
});

test('sotto il minimale i contributi non seguono la RAL', () => {
  const minimale = P.contributi.minimaleGiornaliero * P.contributi.giorniRetribuiti;
  vicino(minimale, 18136.56, 'minimale annuo');

  const attesi = 18136.56 * P.contributi.aliquotaLavoratore;
  for (const ral of [9900, 15000, 16600, 18136.56]) {
    vicino(calcolaNetto(ral, P).contributi.totale, attesi, `contributi su RAL ${ral}`);
  }
  // Il passaggio da minimale ad aliquota sulla RAL non deve produrre scalini.
  const sotto = calcolaNetto(18136.55, P).redditoComplessivo;
  const sopra = calcolaNetto(18136.57, P).redditoComplessivo;
  assert.ok(sopra - sotto < 0.05, `discontinuita' al minimale: ${sotto} -> ${sopra}`);
});

test('trattamento integrativo: confini della banda', () => {
  // Sotto: l'IRPEF lorda non supera la detrazione diminuita di 75 EUR.
  assert.equal(calcolaNetto(9800, P).trattamentoIntegrativo, 0, 'RAL 9.800');
  assert.equal(calcolaNetto(9900, P).trattamentoIntegrativo, 1200, 'RAL 9.900');
  // Sopra: l'imponibile supera i 15.000 EUR.
  assert.equal(calcolaNetto(16600, P).trattamentoIntegrativo, 1200, 'RAL 16.600');
  assert.equal(calcolaNetto(16700, P).trattamentoIntegrativo, 0, 'RAL 16.700');
});

test('la maggiorazione di 65 EUR si legge sull imponibile, non sulla RAL', () => {
  // A RAL 25.000 l'imponibile e' 22.702,50: sotto la soglia dei 25.000.
  const sotto = calcolaNetto(25000, P);
  vicino(sotto.redditoComplessivo, 22702.50, 'imponibile a RAL 25.000');
  vicino(sotto.detrazione, 2394.93, 'detrazione senza maggiorazione');

  // Serve una RAL di ~27.531 perche' l'imponibile superi i 25.000.
  const sopra = calcolaNetto(27531, P);
  vicino(sopra.redditoComplessivo, 25000.90, 'imponibile a RAL 27.531');
  vicino(sopra.detrazione, 2249.53, 'detrazione con maggiorazione');
});

test('il netto non e monotono: cliff dell addizionale comunale di Milano', () => {
  // L'esenzione e' una soglia secca: a 23.000 EUR di imponibile si passa
  // da zero a 0,8% sull'intero imponibile.
  const sotto = calcolaNetto(25327, P);
  const sopra = calcolaNetto(25328, P);
  vicino(sotto.redditoComplessivo, 22999.45, 'imponibile sotto soglia');
  assert.equal(sotto.addizionali.comunale, 0, 'nessuna addizionale sotto soglia');
  vicino(sopra.addizionali.comunale, 184.00, 'addizionale sopra soglia');
  vicino(sotto.nettoAnnuo - sopra.nettoAnnuo, 183.40, 'caduta del netto');
});

test('il netto non e monotono: uscita dal trattamento integrativo', () => {
  // A 15.000 EUR di imponibile agiscono insieme tre norme diverse:
  // il TI si azzera (-1.200), l'aliquota della somma esente scende dal
  // 5,3% al 4,8% (-70), la detrazione art. 13 salta a ~3.100 (+1.145).
  const sotto = calcolaNetto(16600, P);
  const sopra = calcolaNetto(16700, P);
  vicino(sotto.nettoAnnuo, 15261.39, 'netto a RAL 16.600');
  vicino(sopra.nettoAnnuo, 15209.13, 'netto a RAL 16.700');
  vicino(sotto.nettoAnnuo - sopra.nettoAnnuo, 52.26, 'caduta del netto');
  vicino(sotto.sommaEsente, 791.46, 'somma esente al 5,3%');
  vicino(sopra.sommaEsente, 721.60, 'somma esente al 4,8%');
});

test('somma esente e ulteriore detrazione non si sovrappongono mai', () => {
  for (const ral of [9900, 16600, 22000, 25000, 30000, 38000, 45000]) {
    const r = calcolaNetto(ral, P);
    assert.ok(
      r.sommaEsente === 0 || r.detrazioneCuneo === 0,
      `RAL ${ral}: entrambe le misure attive (${r.sommaEsente}, ${r.detrazioneCuneo})`
    );
  }
});

test('input non validi: nessun calcolo, errore tipizzato', () => {
  for (const v of [0, -1, -50000]) {
    assert.throws(() => calcolaNetto(v, P), RangeError, `RAL ${v}`);
  }
  assert.throws(() => calcolaNetto(RAL_MASSIMA + 1, P), RangeError, 'oltre il limite');
  for (const v of ['35000', null, undefined, NaN, Infinity, {}]) {
    assert.throws(() => calcolaNetto(v, P), TypeError, `RAL ${String(v)}`);
  }
});

test('sotto il minimale la RAL puo non bastare a pagare i contributi', () => {
  // I contributi sul minimale valgono 1.666,75 EUR: sotto quella soglia
  // l'imponibile sarebbe negativo e il netto pure.
  for (const ral of [1, 100, 1000, 1666]) {
    assert.throws(() => calcolaNetto(ral, P), RangeError, `RAL ${ral}`);
  }
  assert.ok(calcolaNetto(1700, P).redditoComplessivo > 0, 'RAL 1.700 resta calcolabile');
});

test('nessun valore non finito su tutto il dominio ammesso', () => {
  const passo = 250;
  for (let ral = 1750; ral <= 200000; ral += passo) {
    const r = calcolaNetto(ral, P);
    for (const [chiave, valore] of Object.entries(r)) {
      const numeri = typeof valore === 'object' ? Object.values(valore) : [valore];
      for (const n of numeri) {
        assert.ok(Number.isFinite(n), `RAL ${ral}, voce ${chiave}: valore non finito (${n})`);
        assert.ok(n >= 0, `RAL ${ral}, voce ${chiave}: valore negativo (${n})`);
      }
    }
  }
});

test('lettura dell importo nel formato italiano', () => {
  const casi = {
    '35000': 35000,
    '35.000': 35000,
    '1.234.567': 1234567,
    '1.234,56': 1234.56,
    '35000,50': 35000.5,
    // Punto seguito da due cifre: separatore decimale, non delle migliaia.
    '35000.50': 35000.5,
    ' 35 000 ': 35000
  };
  for (const [testo, atteso] of Object.entries(casi)) {
    assert.equal(leggiImporto(testo), atteso, `lettura di "${testo}"`);
  }

  for (const vuoto of ['', '   ']) {
    assert.throws(() => leggiImporto(vuoto), RangeError, `stringa vuota "${vuoto}"`);
  }
  for (const invalido of ['abc', '3,5,6', '12€', '--5', '1,2.3']) {
    assert.throws(() => leggiImporto(invalido), TypeError, `input "${invalido}"`);
  }
  // Il segno negativo supera il formato e viene respinto dal motore, con il
  // messaggio giusto: e' un problema di dominio, non di sintassi.
  assert.equal(leggiImporto('-5'), -5);
  assert.throws(() => calcolaNetto(leggiImporto('-5'), P), RangeError);
});

test('coerenza interna dei parametri', () => {
  const d = P.detrazioneLavoroDipendente;
  // I divisori sono scritti a mano perche' compaiono letterali nella norma:
  // qui si verifica che non siano andati alla deriva rispetto ai limiti di fascia.
  assert.equal(d.fascia2.ampiezza, d.fascia2.limite - d.fascia1.limite, 'ampiezza fascia 2');
  assert.equal(d.fascia3.ampiezza, d.fascia3.limite - d.fascia2.limite, 'ampiezza fascia 3');

  for (const [nome, scaglioni] of Object.entries({
    IRPEF: P.irpef.scaglioni,
    regionale: P.addizionali.regionale.scaglioni
  })) {
    const crescenti = scaglioni.every((s, i) => i === 0 || s.fino > scaglioni[i - 1].fino);
    assert.ok(crescenti, `scaglioni ${nome} non crescenti`);
    assert.equal(scaglioni.at(-1).fino, Infinity, `ultimo scaglione ${nome} non aperto`);
  }

  assert.ok(
    P.contratto.mensilitaAmmesse.includes(P.contratto.mensilita),
    'mensilita di default non presente fra quelle ammesse'
  );
});

test('i parametri sono l unica fonte dei valori fiscali', () => {
  // Se il motore contenesse un valore cablato, cambiarlo nei parametri
  // non cambierebbe il risultato.
  const modificati = structuredClone(P);
  modificati.irpef.scaglioni[0].aliquota = 0.10;
  // 28.000 x 10% + 3.783,50 x 33%
  vicino(calcolaNetto(35000, modificati).irpefLorda, 4048.56, 'IRPEF con aliquota alterata');

  const senzaEsenzione = structuredClone(P);
  senzaEsenzione.addizionali.comunale.sogliaEsenzione = 0;
  const r = calcolaNetto(25327, senzaEsenzione);
  vicino(r.addizionali.comunale, 22999.45 * 0.008, 'addizionale senza esenzione');
});

test('le mensilita sono un argomento, non una costante', () => {
  const netto = calcolaNetto(35000, P).nettoAnnuo;
  for (const m of P.contratto.mensilitaAmmesse) {
    vicino(calcolaNetto(35000, P, m).nettoMensile, netto / m, `netto su ${m} mensilita`);
  }
});
