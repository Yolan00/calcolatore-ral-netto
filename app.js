// Collante fra il form e il motore di calcolo. Nessuna aritmetica fiscale:
// se qui servisse un calcolo, significherebbe che manca una funzione in calcolo.js.

import { PARAMETRI_2026 } from './parametri-2026.js';
import { calcolaNetto } from './calcolo.js';

const form = document.querySelector('#calcolatore');
const contenitore = document.querySelector('#risultato');

// Le mensilità ammesse arrivano dai parametri e non dal markup: restano una
// sola fonte di verità, coerente con il resto del modello.
function popolaMensilita(select, contratto) {
  for (const m of contratto.mensilitaAmmesse) {
    select.add(new Option(m, m, false, m === contratto.mensilita));
  }
}

function mostra(nodo) {
  contenitore.replaceChildren(nodo);
}

// Temporaneo: dump grezzo per verificare che l'intero oggetto arrivi in pagina.
// Sostituito dal breakdown impaginato al passo successivo.
function rendiGrezzo(risultato) {
  const pre = document.createElement('pre');
  pre.textContent = JSON.stringify(risultato, null, 2);
  return pre;
}

function rendiErrore(messaggio) {
  const p = document.createElement('p');
  p.textContent = messaggio;
  return p;
}

form.addEventListener('submit', (evento) => {
  evento.preventDefault();
  const { ral, mensilita } = form.elements;
  try {
    mostra(rendiGrezzo(calcolaNetto(Number(ral.value), PARAMETRI_2026, Number(mensilita.value))));
  } catch (errore) {
    mostra(rendiErrore(errore.message));
  }
});

popolaMensilita(form.elements.mensilita, PARAMETRI_2026.contratto);
