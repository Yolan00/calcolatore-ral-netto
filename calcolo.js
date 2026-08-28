// Motore di calcolo da RAL a netto. Funzioni pure: nessun riferimento al DOM,
// nessun accesso a variabili globali, i parametri arrivano sempre come argomento.
//
// Nessun arrotondamento intermedio: si calcola in virgola mobile piena e si
// arrotonda solo in fase di visualizzazione. Arrotondare a ogni passaggio
// accumula scarti e rende impossibile il confronto con i riferimenti esterni.

// Limiti di dominio, non parametri fiscali: non cambiano con l'anno d'imposta.
export const RAL_MASSIMA = 10_000_000;

function validaRal(ral) {
  if (typeof ral !== 'number' || !Number.isFinite(ral)) {
    throw new TypeError('La RAL deve essere un numero.');
  }
  if (ral <= 0) {
    throw new RangeError('La RAL deve essere maggiore di zero.');
  }
  if (ral > RAL_MASSIMA) {
    throw new RangeError(`La RAL supera il limite gestito di ${RAL_MASSIMA} €.`);
  }
}

// Unica implementazione del calcolo progressivo: serve sia l'IRPEF nazionale
// sia l'addizionale regionale, che sono la stessa operazione su tabelle diverse.
export function imposteAScaglioni(reddito, scaglioni) {
  let imposta = 0;
  let sogliaPrecedente = 0;
  for (const { fino, aliquota } of scaglioni) {
    if (reddito <= sogliaPrecedente) break;
    imposta += (Math.min(reddito, fino) - sogliaPrecedente) * aliquota;
    sogliaPrecedente = fino;
  }
  return imposta;
}

export function contributiInps(ral, p) {
  const { aliquotaLavoratore, aliquotaAggiuntiva, sogliaAggiuntiva, massimale } = p.contributi;
  const imponibile = Math.min(ral, massimale);
  const ivs = imponibile * aliquotaLavoratore;
  const aggiuntivo = Math.max(0, imponibile - sogliaAggiuntiva) * aliquotaAggiuntiva;
  return { imponibile, ivs, aggiuntivo, totale: ivs + aggiuntivo };
}

export function detrazioneLavoroDipendente(reddito, p) {
  const { fascia1, fascia2, fascia3, maggiorazione } = p.detrazioneLavoroDipendente;

  let detrazione;
  if (reddito <= fascia1.limite) {
    detrazione = fascia1.importo;
  } else if (reddito <= fascia2.limite) {
    detrazione = fascia2.base + fascia2.incremento * (fascia2.limite - reddito) / fascia2.ampiezza;
  } else if (reddito <= fascia3.limite) {
    detrazione = fascia3.base * (fascia3.limite - reddito) / fascia3.ampiezza;
  } else {
    return 0;
  }

  const oltreMinimo = reddito > maggiorazione.redditoMin;
  const entroMassimo = reddito <= maggiorazione.redditoMax;
  return oltreMinimo && entroMassimo ? detrazione + maggiorazione.importo : detrazione;
}

export function ulterioreDetrazione(reddito, p) {
  const { importo, redditoMin, redditoPieno, redditoAzzeramento } = p.cuneo.ulterioreDetrazione;
  // Il confronto con redditoMin è stretto: a 20.000 € esatti spetta la somma
  // esente, non questa detrazione. Le due misure non si sovrappongono mai.
  if (reddito <= redditoMin || reddito > redditoAzzeramento) return 0;
  if (reddito <= redditoPieno) return importo;
  return importo * (redditoAzzeramento - reddito) / (redditoAzzeramento - redditoPieno);
}

// La norma applica la percentuale al reddito di lavoro dipendente e legge la
// soglia sul reddito complessivo: sono due basi distinte, che qui coincidono
// perché il modello prevede un'unica fonte di reddito.
export function sommaEsente(reddito, p) {
  const { limiteReddito, aliquote } = p.cuneo.sommaEsente;
  if (reddito > limiteReddito) return 0;
  return reddito * aliquote.find((a) => reddito <= a.fino).aliquota;
}

export function trattamentoIntegrativo(reddito, irpefLorda, detrazione, p) {
  const { importo, limiteReddito, correzioneDetrazione } = p.trattamentoIntegrativo;
  if (reddito > limiteReddito) return 0;
  return irpefLorda > detrazione - correzioneDetrazione ? importo : 0;
}

export function addizionaliLocali(reddito, irpefNetta, p) {
  const { sogliaMinimaIrpefNetta, regionale, comunale } = p.addizionali;
  if (irpefNetta <= sogliaMinimaIrpefNetta) return { regionale: 0, comunale: 0 };

  return {
    regionale: imposteAScaglioni(reddito, regionale.scaglioni),
    // Soglia secca, non franchigia: sopra il limite si paga sull'intero imponibile.
    comunale: reddito <= comunale.sogliaEsenzione ? 0 : reddito * comunale.aliquota
  };
}

export function calcolaNetto(ral, p, mensilita = p.contratto.mensilita) {
  validaRal(ral);

  const contributi = contributiInps(ral, p);
  const redditoComplessivo = ral - contributi.totale;

  const irpefLorda = imposteAScaglioni(redditoComplessivo, p.irpef.scaglioni);
  const detrazione = detrazioneLavoroDipendente(redditoComplessivo, p);
  const detrazioneCuneo = ulterioreDetrazione(redditoComplessivo, p);
  const irpefNetta = Math.max(0, irpefLorda - detrazione - detrazioneCuneo);

  const addizionali = addizionaliLocali(redditoComplessivo, irpefNetta, p);
  const totaleImposte = irpefNetta + addizionali.regionale + addizionali.comunale;

  // Somma esente e trattamento integrativo si sommano al netto: la prima non
  // concorre al reddito, il secondo è un credito erogato in busta. Nessuna
  // delle due riduce l'imposta, e nessuna entra nelle basi calcolate sopra.
  const esente = sommaEsente(redditoComplessivo, p);
  const integrativo = trattamentoIntegrativo(redditoComplessivo, irpefLorda, detrazione, p);
  const nettoAnnuo = redditoComplessivo - totaleImposte + esente + integrativo;

  return {
    ral,
    contributi,
    redditoComplessivo,
    irpefLorda,
    detrazione,
    detrazioneCuneo,
    irpefNetta,
    addizionali,
    sommaEsente: esente,
    trattamentoIntegrativo: integrativo,
    totaleImposte,
    totaleTrattenute: contributi.totale + totaleImposte,
    nettoAnnuo,
    mensilita,
    nettoMensile: nettoAnnuo / mensilita
  };
}
