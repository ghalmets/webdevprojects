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
| `ponyrennen/reiter-spiel.mjs` | Steuerung, Spielablauf und Zeichnen der Wiese und des Ponys |

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


## Lotta & Vampirinchen

Ein zweites Spiel im Ordner `vampirinchen/`; Pony Sprint bleibt im Ordner `ponyrennen/` erhalten.

- Spielen: https://ghalmets.github.io/webdevprojects/vampirinchen/
- Alle vier Pfeiltasten, W A S D oder die vier Bildschirmtasten gedrückt halten.
- Fünf Kapitel: großer scrollender Garten, Schlossbrücke und Falltür, Keller mit Leiter, Obervampir-Turm, Heimflug.
- Hecken versperren den direkten Weg. Vampirinchen läuft im Garten herum.
- Vampire patrouillieren im Garten und Keller. Eine Berührung schiebt Lotta sanft zurück; nach kurzer Schutzzeit kann sie weiter. Keine verlorenen Leben.
- Schlüssel vor der Brücke und im Keller sammeln. Die Brückenmitte nicht verlassen. Auf die Falltür laufen. An der Leiter ↑ halten; beim Obervampir nach drei Zaubersteinen ↑ drücken. Mit Flügeln nach rechts und unten bis zum Haus fliegen. Pause mit P / Escape oder der Pausentaste.
- `index.html`: Geschichte und Texte; `style.css`: Gestaltung; `spiel.mjs`: Ablauf und Zeichnung; `regeln.mjs`: Tempo, Hecken und Bewegungsregeln.

Prüfen: `node --test tests/*.test.mjs`


## UHC Tulln U9 – Einhorn-Cup

Drittes Spiel unter https://ghalmets.github.io/webdevprojects/handball/ – ein selbstgemachtes Fanspiel, mit eigenständig gezeichneten Figuren ohne Vereinslogo.

- Bewegen: Pfeiltasten oder W A S D, am Handy linkes Steuerkreuz.
- Zweites Bedienelement: oben Schießen (Leertaste), darunter Passen (E); Haken (H) als zusätzliche Taste.
- Mit Ball nach rechts in die gelbe Wurfzone laufen und außerhalb des Torraums werfen.
- Passen wechselt zur freien Mitspielperson. Haken funktioniert nur nah vor einer Gegnerin: ein kurzer animierter Seitenschritt (höchstens 56 Pixel), keine freien Sprünge. Weiße Einhörner mit bunten Hörnern spielen gegen die schwarz-rote Mädchenmannschaft.
- Die Mädchenmannschaft spielt gegen drei Einhörner im Gegenangriff. Nach deinem Wurf laufen sie nach links aufs Tor, wechseln per Pass die Werferin und schießen schneller. Als Torhüterin mit ↑ / ↓ reagieren: Zielhinweis erst 0,45 Sekunden vor Abwurf, kleinere Haltereichweite.
- 90 Sekunden pro Partie; Pause mit P / Escape oder Pausentaste.
- `handball/regeln.mjs`: Spielzeit, Tempo, Passauswahl und Torwart-Reichweite. `spiel.mjs`: Spielablauf und Zeichnung.


## Vampir-Rallye

Neues Spiel: https://ghalmets.github.io/webdevprojects/autofahrt/

- ↑ / W: Gas. ↓ / S: bremsen und rückwärts. ← / → oder A / D: lenken.
- Am Handy links die beiden Lenktasten und rechts Gas/Rückwärts gedrückt halten; beides gleichzeitig ist möglich. Die Lenkung reagiert auch im Stand und ist bei hohem Tempo ruhiger.
- Fahrzeugphysik mit Beschleunigung, Ausrollen und umgekehrter Lenkrichtung beim Rückwärtsfahren.
- Längere Strecke mit über 5 km, 17 Hindernissen und sechs schnelleren patrouillierenden Vampiren. Höchsttempo 50 % höher; stärkere Beschleunigung und schnellere Lenkung. Vampire stoppen das Auto kurz; anschließend gibt es eine Schutzzeit zum Weiterfahren.
- Grüne Fähnchen speichern den Fortschritt. R oder „Zum Fähnchen“ setzt das Auto frei auf die Straße.
- Ziel am nördlichen Straßenende. Pause mit P / Escape oder Pausentaste.
- `autofahrt/regeln.mjs`: Fahrzeugphysik und Strecke; `spiel.mjs`: Spielablauf und Zeichnung.


## Die Zahlenreise – ab Klasse 2

https://ghalmets.github.io/webdevprojects/plusreise/

Zahlenraum bis 100: reine Zehner addieren (30 + 40), reiner Zehner + gemischte zweistellige Zahl (20 + 34, auch umgekehrt), Zehner-/Einerstelle erkennen, Einer minus Einer sowie zweistellig minus einstellig mit Zehnerübergang (32 − 7). Im Lernmix sind sechs von zehn Aufgaben Zehner-Plus, eine Stellenwertaufgabe, eine Bündelungsaufgabe und zwei Minusaufgaben; zwei der sechs Plusaufgaben sind Ergänzungen. Ergänzungen nutzen dieselben Zahlenpaare (30 + □ = 70 oder □ + 20 = 54). Beim Bündeln werden 10 bis 100 Einer in Zehnerpakete und übrige Einer zerlegt, mit zwei separaten Eingabefeldern. Alle Übungsarten sind auch einzeln auswählbar. Zehn richtige Aufgaben ergeben zehn Sonnen. Beliebig viele Versuche, keine Zeitbegrenzung, keine Strafe. Bildschirmtastatur oder normale Zahleneingabe. Tipps erklären das Auffüllen zum nächsten Zehner oder das Zerlegen der zweiten Zahl. Ein Wechsel der Reiseroute startet eine neue Runde.

`plusreise/regeln.mjs` erzeugt Aufgaben und Tipps; `spiel.mjs` steuert Eingabe, Fortschritt und Rundenauswertung.
