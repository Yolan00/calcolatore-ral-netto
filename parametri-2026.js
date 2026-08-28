// Parametri fiscali e contributivi — anno d'imposta 2026.
// Caso modellato: dipendente privato a tempo indeterminato, residente a Milano (Lombardia).
// Verifica puntuale delle fonti in "Dati e fonti/parametri-fiscali-2026.md".
//
// Il motore riceve questo oggetto come argomento e non lo importa: cambiare anno
// significa passargli un altro file, non modificare calcolo.js.

export const PARAMETRI_2026 = {
  anno: 2026,
  dataVerifica: '2026-08-28',

  contributi: {
    aliquotaLavoratore: 0.0919,
    aliquotaAggiuntiva: 0.01,
    sogliaAggiuntiva: 56224,
    massimale: 122295,
    minimaleGiornaliero: 58.13,
    // 26 giorni x 12 mesi: convenzione standard per un anno pieno, non un
    // valore della circolare INPS. E' un'assunzione del modello, non un dato.
    giorniRetribuiti: 312,
    fonte: {
      rif: 'Circolare INPS n. 6 del 30/01/2026; art. 3-ter D.L. 384/1992',
      url: 'https://www.inps.it/it/it/inps-comunica/notizie/dettaglio-news-page.news.2026.02.lavoratori-dipendenti-limite-minimo-di-retribuzione-giornaliera-2026.html'
    }
  },

  irpef: {
    scaglioni: [
      { fino: 28000, aliquota: 0.23 },
      { fino: 50000, aliquota: 0.33 },
      { fino: Infinity, aliquota: 0.43 }
    ],
    fonte: {
      rif: 'Art. 11 co. 1 TUIR, come modificato dalla L. 199/2025 (Legge di Bilancio 2026)',
      url: 'https://www.mef.gov.it/focus/Principali-misure-della-legge-di-bilancio-2026/'
    }
  },

  // Le tre fasce hanno forme algebriche diverse (costante, lineare a due termini,
  // lineare a un termine): restano tre rami espliciti nel motore invece di una
  // tabella comune, che sarebbe meno leggibile della norma che trascrive.
  // Il minimo garantito di 690 € (1.380 € a tempo determinato) non compare:
  // rileva solo per rapporti di durata inferiore all'anno, che il modello esclude.
  detrazioneLavoroDipendente: {
    fascia1: { limite: 15000, importo: 1955 },
    fascia2: { limite: 28000, base: 1910, incremento: 1190, ampiezza: 13000 },
    fascia3: { limite: 50000, base: 1910, ampiezza: 22000 },
    maggiorazione: { importo: 65, redditoMin: 25000, redditoMax: 35000 },
    fonte: {
      rif: 'Art. 13 co. 1 TUIR e maggiorazione co. 1-bis',
      url: 'https://www.brocardi.it/testo-unico-imposte-redditi/titolo-i/capo-i/art13.html'
    }
  },

  cuneo: {
    // Attenzione: "aliquote", non "scaglioni". Non è un'imposta progressiva —
    // si individua la fascia e si applica quell'unica aliquota all'intero reddito.
    // Passare questa lista a imposteAScaglioni darebbe un risultato sbagliato.
    sommaEsente: {
      limiteReddito: 20000,
      aliquote: [
        { fino: 8500, aliquota: 0.071 },
        { fino: 15000, aliquota: 0.053 },
        { fino: 20000, aliquota: 0.048 }
      ]
    },
    ulterioreDetrazione: {
      importo: 1000,
      redditoMin: 20000,
      redditoPieno: 32000,
      redditoAzzeramento: 40000
    },
    fonte: {
      rif: 'L. 207/2024 artt. 4-6, resa strutturale dalla L. 199/2025; circolare AdE 4/E del 16/05/2025',
      url: 'https://www.fiscoetasse.com/new-rassegna-stampa/1178-taglio-cuneo-fiscale-ecco-le-novita-2025.html'
    }
  },

  // Spetta se l'imposta lorda supera la detrazione art. 13 diminuita di 75 €.
  // Il ramo 15.001–28.000 € della norma non è implementato: richiede che le
  // detrazioni superino l'imposta lorda, condizione dimostrabilmente mai vera
  // senza familiari a carico né mutui ante 2021 (le curve si incrociano a
  // reddito ≈ 13.911 €, sotto il limite di fascia). Vedi README.
  trattamentoIntegrativo: {
    importo: 1200,
    limiteReddito: 15000,
    correzioneDetrazione: 75,
    fonte: {
      rif: 'Art. 1 D.L. 3/2020, conv. L. 21/2020; non modificato dalla L. 199/2025',
      url: 'https://fiscomania.com/trattamento-integrativo-come-funziona/'
    }
  },

  addizionali: {
    // Art. 50 D.Lgs. 446/1997: dovute solo se residua IRPEF dopo le detrazioni.
    // La soglia governa entrambe le addizionali, per questo sta qui e non dentro una delle due.
    sogliaMinimaIrpefNetta: 12,

    regionale: {
      nome: 'Lombardia',
      scaglioni: [
        { fino: 15000, aliquota: 0.0123 },
        { fino: 28000, aliquota: 0.0158 },
        { fino: 50000, aliquota: 0.0172 },
        { fino: Infinity, aliquota: 0.0173 }
      ],
      fonte: {
        rif: 'Art. 72 l.r. Lombardia 10/2003, come modificato dalla l.r. 5/2022',
        url: 'https://www.regione.lombardia.it/bollo-auto-e-tributi-regionali/red-addizionale-regionale-irpef'
      }
    },

    // Soglia secca, non franchigia: superati i 23.000 € si paga sull'intero
    // imponibile. Da qui la discontinuità di ~184 € del netto a 23.001 €.
    comunale: {
      nome: 'Milano',
      aliquota: 0.008,
      sogliaEsenzione: 23000,
      fonte: {
        rif: 'Delibera Comune di Milano n. 46 del 28/09/2020, confermata annualmente',
        url: 'https://www1.finanze.gov.it/finanze2/dipartimentopolitichefiscali/fiscalitalocale/nuova_addcomirpef/risultato.htm?anno=9999&lista=1&pagina=lombardia.htm&cm=&pr=MI&cc=F205&r=1'
      }
    },

    fonte: {
      rif: 'Art. 50 D.Lgs. 446/1997 — regola di incapienza',
      url: 'https://www.finanze.gov.it/it/fiscalita/fiscalita-regionale-e-locale/Addizionale-regionale-allIRPEF/disciplina-del-tributo/'
    }
  },

  // Non è un parametro fiscale ma contrattuale: è il default del selettore in pagina.
  contratto: {
    nome: 'CCNL Terziario, distribuzione e servizi',
    mensilita: 14,
    mensilitaAmmesse: [12, 13, 14]
  }
};
