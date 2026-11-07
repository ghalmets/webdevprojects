# 🎮 Unsere Spielewerkstatt

Mehrere Spiele leben in diesem Repository jeweils in einem eigenen Unterordner. Die `index.html` im Hauptverzeichnis ist die gemeinsame Startseite mit Links zu allen Spielen.

## Aktuelles Spiel: Pony Sprint

Ein kleines Pferderennspiel aus der **Reiterperspektive** als Ausgangspunkt zum gemeinsamen Vibe-Coden mit Kindern. Du blickst vom Sattel über die Ponyohren nach vorne. Das Pony läuft von selbst.

- **↑ / W / obere Bildschirmtaste:** springen. Für den nächsten Sprung erneut drücken.
- **↓ / S / untere Bildschirmtaste halten:** schneller nach unten landen; am Boden unter Ästen ducken.
- Über Baumstämme springen, unter Ästen ducken und Karotten auf dem Weg oder in Sprunghöhe sammeln (+10 Punkte).
- Drei Herzen, 60 Sekunden. **P / Escape / Pausentaste:** Pause. Fensterwechsel pausiert automatisch.

Beide Steuerungstasten funktionieren auch auf dem Handy.

## Lokal loslegen

Keine Installation und kein Build nötig. Im Projektordner:

```sh
python3 -m http.server 8000
```

Öffne http://localhost:8000 für die Spieleübersicht oder http://localhost:8000/ponyrennen/ für das Pferderennspiel. Wegen der JavaScript-Module bitte über diesen Server öffnen, nicht per Doppelklick auf die HTML-Datei. Alternativ funktioniert die Erweiterung „Live Server“ in VS Code.

## Wo ändere ich was?

| Datei | Inhalt |
| --- | --- |
| `index.html` | Gemeinsame Startseite mit Links zu den Spielen |
| `ponyrennen/index.html` | Texte, Knöpfe und Pony-Werkstatt |
| `ponyrennen/style.css` | Farben, Schrift und Layout |
| `ponyrennen/core.mjs` | Spielregeln: Dauer, Herzen, Punkte, Tempo und Trefferprüfung |
| `ponyrennen/game.mjs` | Steuerung, Spielablauf und Zeichnen der Wiese und des Ponys |

Die Pony-Werkstatt ändert Namen, Fellfarbe und Tempo direkt im Spiel. Der persönliche Rekord bleibt lokal in diesem Browser gespeichert. Das Spiel benötigt keinen Account und kein Backend. Die optionalen Webfonts kommen von Google Fonts; mit Systemschrift funktioniert es ebenfalls.

## Erste Ideen für eure Prompts

Beginnt mit einer kleinen Änderung, spielt eine Runde und entscheidet dann, was als Nächstes Spaß macht:

- „Jede Karotte soll 20 Punkte zählen.“
- „Unser Pony soll Luna heißen und eine lila Mähne bekommen.“
- „Füge einen einfachen Modus mit fünf Herzen hinzu.“
- „Zeige nach dem Rennen einen lustigen Glückwunsch an.“
- „Erkläre uns die Funktion `advanceJump`, als wären wir zehn Jahre alt.“
- „Baue ein Einhorn mit einem Regenbogenschweif ein.“

Hilfreicher Zusatz: „Ändere nur diese eine Sache und erkläre danach, welche Datei du geändert hast.“ Keine Namen, Fotos oder persönlichen Daten der Kinder sind nötig.

## Regeln prüfen

Mit Node.js (ab Version 18): `node --test tests/core.test.mjs`

Die Anwendung selbst benötigt Node.js nicht.

## GitHub Pages

In **Settings → Pages** als Quelle **Deploy from a branch**, Branch **main**, Ordner **/ (root)** wählen. Kein Build nötig.

- Spieleübersicht: https://ghalmets.github.io/webdevprojects/
- Pony Sprint: https://ghalmets.github.io/webdevprojects/ponyrennen/

## Ein weiteres Spiel hinzufügen

1. Einen neuen Ordner anlegen, zum Beispiel `weltraumspiel/`.
2. Die `index.html`, CSS- und JavaScript-Dateien dieses Spiels darin ablegen.
3. Auf der Startseite im Hauptverzeichnis einen weiteren Link zu `./weltraumspiel/` ergänzen.

Links und Dateien relativ einbinden, etwa `./style.css`, damit sie unter dem Repository-Pfad funktionieren. Die Pages-Einstellung bleibt unverändert.
