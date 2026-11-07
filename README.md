# 🐴 Pony Sprint

Ein kleines Pferderennspiel als Ausgangspunkt zum gemeinsamen Vibe-Coden mit Kindern. Das Pony läuft von selbst. Mit **↑ / ↓**, **W / S** oder den Bildschirmtasten lenkst du nach oben und unten. Sammle Sterne (+10 Punkte), weiche Baumstämmen und Steinen aus und erreiche mit drei Herzen das Ende der 60 Sekunden. Mit **P / Escape** oder der Pausentaste pausierst du. Beim Wechsel in ein anderes Fenster pausiert das Spiel automatisch.

## Lokal loslegen

Keine Installation und kein Build nötig. Im Projektordner:

```sh
python3 -m http.server 8000
```

Öffne http://localhost:8000. Wegen der JavaScript-Module bitte über diesen Server öffnen, nicht per Doppelklick auf die HTML-Datei. Alternativ funktioniert die Erweiterung „Live Server“ in VS Code.

## Wo ändere ich was?

| Datei | Inhalt |
| --- | --- |
| `index.html` | Texte, Knöpfe und Pony-Werkstatt |
| `style.css` | Farben, Schrift und Layout |
| `core.mjs` | Spielregeln: Dauer, Herzen, Punkte, Tempo und Trefferprüfung |
| `game.mjs` | Steuerung, Spielablauf und Zeichnen der Wiese und des Ponys |

Die Pony-Werkstatt ändert Namen, Fellfarbe und Tempo direkt im Spiel. Der persönliche Rekord bleibt lokal in diesem Browser gespeichert. Das Spiel benötigt keinen Account und kein Backend. Die optionalen Webfonts kommen von Google Fonts; mit Systemschrift funktioniert es ebenfalls.

## Erste Ideen für eure Prompts

Beginnt mit einer kleinen Änderung, spielt eine Runde und entscheidet dann, was als Nächstes Spaß macht:

- „Mach aus den Sternen Karotten. Jede Karotte zählt 20 Punkte.“
- „Unser Pony soll Luna heißen und eine lila Mähne bekommen.“
- „Füge einen einfachen Modus mit fünf Herzen hinzu.“
- „Zeige nach dem Rennen einen lustigen Glückwunsch an.“
- „Erkläre uns die Funktion `spawn`, als wären wir zehn Jahre alt.“
- „Baue ein Einhorn mit einem Regenbogenschweif ein.“

Hilfreicher Zusatz: „Ändere nur diese eine Sache und erkläre danach, welche Datei du geändert hast.“ Keine Namen, Fotos oder persönlichen Daten der Kinder sind nötig.

## Regeln prüfen

Mit Node.js (ab Version 18): `node --test tests/core.test.mjs`

Die Anwendung selbst benötigt Node.js nicht. Für eine statische Veröffentlichung werden die fünf Anwendungsdateien unverändert ins Verzeichnis `dist/` kopiert.
