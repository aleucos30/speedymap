# SpeedyMap

Prototipo web per la logistica last-mile in Sicilia: aiuta gli autisti a pianificare le consegne sulla mappa ed evitare le ZTL, e dà alle aziende una vista sulla flotta.

> **Stato:** prototipo / MVP sviluppato in pochi giorni (19-20 maggio 2026) con strumenti di sviluppo basati su IA. Nasce dai requisiti raccolti presso un cliente di Bagheria, che ho tradotto in funzionalità e priorità. Non è un prodotto in produzione.

## Origine dei requisiti
Il progetto parte da una richiesta concreta di un cliente di Bagheria, un'azienda del settore cinematografico e teatrale che ha anche esigenze di spostamento e consegna di materiali. Ho raccolto le sue esigenze, le ho tradotte in ruoli utente e funzionalità (sezioni seguenti) e ho definito cosa includere nel primo MVP e cosa rimandare. Il prototipo è stato mostrato al cliente e ha ricevuto un riscontro positivo.

## Problema
Gli autisti che consegnano nei centri storici (es. Palermo) rischiano multe entrando in ZTL senza permesso, e le piccole aziende di trasporto non hanno uno strumento semplice per seguire i propri mezzi.

## Utenti e ruoli
| Ruolo | Cosa fa |
|---|---|
| **Privato** | Gestisce le proprie consegne e il proprio veicolo |
| **Dipendente** | Si collega a un'azienda tramite codice e riceve disposizioni |
| **Azienda** | Vede i propri autisti nel pannello flotta e invia note di consegna |

La modalità Azienda non è selezionabile liberamente in registrazione: si abilita solo manualmente (scelta di sicurezza).

## Funzionalità
- Registrazione e login con differenziazione dei ruoli
- Mappa interattiva (Leaflet, tema scuro) centrata su Palermo
- Perimetri ZTL di Palermo e Catania (poligoni semplificati) con avviso di ingresso
- Gestione dei mezzi e pulsanti logistici nella plancia dell'autista
- Pannello controllo flotta per l'azienda, con messaggi ai singoli autisti
- Istruzioni di navigazione vocale di base
- Pagina admin con la flotta sulla mappa

## Stack
Next.js 16 · React 19 · TypeScript · Tailwind CSS · Supabase (autenticazione e database) · Leaflet / MapLibre · Turf.js

Lo schema del database è in `setup_db.sql`.

## Avvio in locale
```bash
npm install
cp .env.example .env.local   # poi inserisci le tue chiavi
npm run dev
```
Variabili necessarie:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Limiti noti e prossimi passi
- Le ZTL sono rettangoli approssimativi, non i perimetri ufficiali dei comuni
- La navigazione vocale usa distanza e direzione semplificate, non un motore di routing stradale
- Le policy di sicurezza del database vanno rivedute prima di un uso reale
- Il prossimo passo è la validazione sul campo con gli autisti del cliente, per raccogliere feedback e pianificare la seconda iterazione

## Storia del progetto
Nasce come app mobile (Expo / FastAPI) nel repository `sicily-route-optimizer-v2`, poi riscritta come web app per ridurre la complessità di rilascio.
