// Collante fra il form e il motore di calcolo. Nessuna aritmetica fiscale:
// se qui servisse un calcolo, significherebbe che manca una funzione in calcolo.js.
// L'arrotondamento avviene solo qui, in formattazione.

import { PARAMETRI_2026 } from './parametri-2026.js';
import { calcolaNetto, incidenzaSuRal } from './calcolo.js';
import { euro, percento, leggiImporto, ESEMPI_FORMATO } from './formato.js';

const form = document.querySelector('#calcolatore');
const contenitore = document.querySelector('#risultato');

// Il segno indica sempre l'effetto sul netto, non sulla voce che precede:
// le detrazioni riducono l'imposta e quindi aumentano il netto.
const SEGNO = { trattenuta: '−', sconto: '+', aggiunta: '+' };

const SEZIONI = [
  {
    titolo: 'Dalla RAL all’imponibile fiscale',
    righe: [
      { etichetta: () => 'RAL — retribuzione annua lorda', valore: (r) => r.ral, tipo: 'lordo' },
      {
        etichetta: (p) => `Contributi INPS a carico del lavoratore (${percento(p.contributi.aliquotaLavoratore, 2)})`,
        valore: (r) => r.contributi.ivs,
        tipo: 'trattenuta'
      },
      {
        etichetta: (p) =>
          `Contributo aggiuntivo ${percento(p.contributi.aliquotaAggiuntiva, 0)} oltre ${euro(p.contributi.sogliaAggiuntiva)}`,
        valore: (r) => r.contributi.aggiuntivo,
        tipo: 'trattenuta'
      },
      { etichetta: () => 'Imponibile fiscale', valore: (r) => r.redditoComplessivo, tipo: 'subtotale' }
    ]
  },
  {
    titolo: 'Dall’imponibile all’IRPEF netta',
    righe: [
      {
        etichetta: (p) => `IRPEF lorda (${p.irpef.scaglioni.map((s) => percento(s.aliquota, 0)).join(' · ')})`,
        valore: (r) => r.irpefLorda,
        tipo: 'trattenuta'
      },
      { etichetta: () => 'Detrazione per lavoro dipendente (art. 13 TUIR)', valore: (r) => r.detrazione, tipo: 'sconto' },
      { etichetta: () => 'Ulteriore detrazione — cuneo fiscale', valore: (r) => r.detrazioneCuneo, tipo: 'sconto' },
      { etichetta: () => 'IRPEF netta', valore: (r) => r.irpefNetta, tipo: 'subtotale' }
    ]
  },
  {
    titolo: 'Addizionali locali',
    righe: [
      {
        etichetta: (p) => `Addizionale regionale — ${p.addizionali.regionale.nome}`,
        valore: (r) => r.addizionali.regionale,
        tipo: 'trattenuta'
      },
      {
        etichetta: (p) => `Addizionale comunale — ${p.addizionali.comunale.nome}`,
        valore: (r) => r.addizionali.comunale,
        tipo: 'trattenuta'
      },
      { etichetta: () => 'Totale trattenute sul lordo', valore: (r) => r.totaleTrattenute, tipo: 'subtotale' }
    ]
  },
  {
    titolo: 'Integrazioni che non riducono l’imposta',
    righe: [
      { etichetta: () => 'Somma esente — cuneo fiscale', valore: (r) => r.sommaEsente, tipo: 'aggiunta' },
      { etichetta: () => 'Trattamento integrativo', valore: (r) => r.trattamentoIntegrativo, tipo: 'aggiunta' }
    ]
  }
];

// Le voci che citano un valore fiscale lo leggono dai parametri, così non
// possono divergere dal calcolo mostrato. Versione estesa nel README.
const ASSUNZIONI = [
  () => 'Tempo indeterminato e tempo pieno per l’intero anno: detrazioni non ridotte pro rata, part-time non rappresentato.',
  (p) => `Residenza a ${p.addizionali.comunale.nome}, regione ${p.addizionali.regionale.nome}.`,
  (p) => `Azienda fino a 15 dipendenti: aliquota INPS ${percento(p.contributi.aliquotaLavoratore, 2)}. Oltre i 15 sale al 9,49% e il netto scende.`,
  (p) => `Iscritto all’INPS dopo il 31/12/1995: solo per loro vale il massimale di ${euro(p.contributi.massimale)}.`,
  (p) => `Contributi su ${p.contributi.giorniRetribuiti} giorni retribuiti l’anno, convenzione per il tempo pieno.`,
  () => 'Nessun familiare a carico, nessun onere deducibile o detraibile.',
  () => 'Nessun fondo pensione, fringe benefit, premio di risultato, straordinario o bonus.',
  () => 'TFR escluso: matura ma non viene erogato in busta.',
  (p) => `Mensilità secondo il ${p.contratto.nome}. Tredicesima e quattordicesima trattate come le altre: la singola busta differisce, il totale annuo no.`,
  () => 'Addizionali imputate all’anno in corso; nella realtà si versano l’anno successivo.'
];

function elemento(tag, testo, classe) {
  const nodo = document.createElement(tag);
  if (testo !== undefined) nodo.textContent = testo;
  if (classe) nodo.className = classe;
  return nodo;
}

function riepilogo(r) {
  const box = elemento('div', undefined, 'riepilogo');
  box.append(
    elemento('p', 'Netto annuo', 'riepilogo-voce'),
    elemento('p', euro(r.nettoAnnuo), 'riepilogo-cifra'),
    elemento('p', `${euro(r.nettoMensile)} su ${r.mensilita} mensilità`, 'riepilogo-mensile'),
    // Rapporto netto/RAL, non trattenute/RAL: dove il cuneo e' attivo i due
    // divergono, e il secondo accanto al netto sarebbe fuorviante.
    elemento('p', `Pari al ${percento(incidenzaSuRal(r.nettoAnnuo, r.ral))} della RAL`, 'riepilogo-nota')
  );
  return box;
}

function riga(definizione, r, p) {
  const tr = elemento('tr', undefined, definizione.tipo);
  const importo = definizione.valore(r);
  if (importo === 0) tr.classList.add('nulla');

  // Nessun segno su una voce nulla: "− 0,00 €" suggerisce una sottrazione che non avviene.
  const segno = importo === 0 ? '' : SEGNO[definizione.tipo] ?? '';
  tr.append(
    elemento('th', definizione.etichetta(p)),
    elemento('td', `${segno}${segno ? ' ' : ''}${euro(importo)}`, 'importo'),
    elemento('td', percento(incidenzaSuRal(importo, r.ral)), 'incidenza')
  );
  return tr;
}

function tabella(r, p) {
  const tab = elemento('table');
  const intestazione = elemento('tr');
  intestazione.append(elemento('th', 'Voce'), elemento('th', 'Importo annuo'), elemento('th', 'Sul lordo'));
  const testa = elemento('thead');
  testa.append(intestazione);
  tab.append(testa);

  for (const sezione of SEZIONI) {
    const corpo = elemento('tbody');
    const titolo = elemento('tr', undefined, 'sezione');
    const cella = elemento('th', sezione.titolo);
    cella.colSpan = 3;
    titolo.append(cella);
    corpo.append(titolo, ...sezione.righe.map((d) => riga(d, r, p)));
    tab.append(corpo);
  }
  return tab;
}

// La base contributiva puo' non coincidere con la RAL: senza dirlo, i contributi
// mostrati sembrerebbero sbagliati.
function noteBase(r, p) {
  if (r.contributi.imponibile === r.ral) return null;
  const sopra = r.contributi.imponibile > r.ral;
  return elemento(
    'p',
    sopra
      ? `Contributi calcolati sul minimale di ${euro(r.contributi.imponibile)} (${euro(p.contributi.minimaleGiornaliero)} al giorno per ${p.contributi.giorniRetribuiti} giorni), non sulla RAL.`
      : `Contributi calcolati sul massimale di ${euro(r.contributi.imponibile)}: la quota di RAL eccedente non è soggetta a contribuzione IVS.`,
    'nota'
  );
}

function rendiRisultato(r, p) {
  const frammento = document.createDocumentFragment();
  frammento.append(riepilogo(r), tabella(r, p));
  const nota = noteBase(r, p);
  if (nota) frammento.append(nota);
  return frammento;
}

function rendiErrore(messaggio) {
  return elemento('p', messaggio, 'errore');
}

function popolaMensilita(select, contratto) {
  for (const m of contratto.mensilitaAmmesse) {
    select.add(new Option(m, m, false, m === contratto.mensilita));
  }
}

form.addEventListener('submit', (evento) => {
  evento.preventDefault();
  const { ral, mensilita } = form.elements;
  try {
    const importo = leggiImporto(ral.value);
    const risultato = calcolaNetto(importo, PARAMETRI_2026, Number(mensilita.value));
    ral.removeAttribute('aria-invalid');
    contenitore.replaceChildren(rendiRisultato(risultato, PARAMETRI_2026));
  } catch (errore) {
    ral.setAttribute('aria-invalid', 'true');
    contenitore.replaceChildren(rendiErrore(errore.message));
    ral.focus();
  }
});

function popolaAssunzioni(lista, p) {
  lista.replaceChildren(...ASSUNZIONI.map((voce) => elemento('li', voce(p))));
}

popolaMensilita(form.elements.mensilita, PARAMETRI_2026.contratto);
popolaAssunzioni(document.querySelector('#assunzioni ul'), PARAMETRI_2026);
document.querySelector('#aiuto-ral').textContent = `Es. ${ESEMPI_FORMATO}`;
