---
name: doonf-disegni
description: >-
  Draws and judges the coloring pictures beside Doonf alphabet letters
  (js/alphabet-icons.js, DOONF_ICONS). Use when a drawing, icon, or
  coloring picture is created or changed, or when the user mentions
  disegni, icone, alfabeto da colorare, cane, dinosauro, or a word
  printed next to a letter. One picture at a time. Letters and flags
  stay as they are.
---

# Disegni da colorare

I disegni stanno in `js/alphabet-icons.js`, dentro `DOONF_ICONS`. Ogni voce è una funzione che restituisce un solo tracciato, nel riquadro da 0 a 100. Le parole stanno in `js/alphabet.js` e puntano a questi id. Un disegno serve tutte le lingue che usano lo stesso id.

Le lettere stanno in `js/alphabet-shapes.js` (Baloo, Fredoka, Nunito). Questo lavoro non le modifica. Le bandiere non si ridisegnano.

## Prova

Guarda il disegno senza leggere la parola scritta sopra. Se in un secondo non esce il nome, il disegno non è pronto. Un tracciato che si chiude non basta. Si giudica sulla scheda, accanto alla lettera, nell'altezza del foglio. L'icona piccola della griglia non conta.

## Come si disegna

Il soggetto riempie il riquadro ed è grande come la lettera accanto.

Il corpo è una forma sola, chiusa, con l'interno libero per il pastello. Le parti che fanno riconoscere il soggetto ci sono, sono grandi e sono attaccate al corpo. Per un cane: orecchio, muso, quattro zampe, coda, occhio. Per un dinosauro: testa, corpo, coda, zampe.

`doonfDisk`, `doonfOval`, `doonfPoly` e `doonfBox` si concatenano nello stesso tracciato. Il disegno non usa evenodd: ogni forma aggiunta viene contornata. Una forma che non tocca il corpo resta un pezzo staccato. Una forma che attraversa il corpo ci disegna una riga in mezzo. Un disco appoggiato sul corpo diventa un anello: va bene per un occhio, se l'occhio si vede.

Un disco o un ovale vanno bene quando sono già l'oggetto. Una catena di angoli non è un animale.

## Esempi

Reggono. La mela (`apple`) è un disco; picciolo e foglia toccano solo la cima. L'albero (`tree`) è una chioma a triangolo, un tronco e il suolo. L'ape (`bee`) è un ovale, due strisce che restano dentro l'ovale, due ali e la testa.

Non reggono. Il cane (`dog`) è un solo zig-zag più un occhio di raggio 3: sembra un sasso. Il dinosauro (`dinosaur`) ha un secondo poligono che non si unisce al corpo: sul foglio quel pezzo galleggia.

## Fare un disegno

1. Leggi la funzione attuale e la parola che la usa. La parola resta quella.
2. Sostituisci solo quella funzione.
3. Apri la scheda di quella parola, con la lettera accanto.
4. Guarda. Se la prova fallisce, ridisegna e riguardalo.
5. Fermati e mostra il foglio. Le altre lettere aspettano l'approvazione.

Si fa una parola, o al massimo le tre parole di una lettera. Poi ci si ferma.
