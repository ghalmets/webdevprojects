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

Zahlenraum bis 100: reine Zehner addieren (30 + 40), reiner Zehner + gemischte zweistellige Zahl (20 + 34, auch umgekehrt), Zehner-/Einerstelle erkennen, Einer minus Einer sowie zweistellig minus einstellig mit Zehnerübergang (32 − 7). Im Lernmix sind sechs von zehn Aufgaben Zehner-Plus, eine Stellenwertaufgabe, eine Bündelungsaufgabe und zwei Minusaufgaben; zwei der sechs Plusaufgaben sind Ergänzungen. Bei Ergänzungen fehlt immer ein reiner Zehner (34 + □ = 54 oder □ + 34 = 54; auch 30 + □ = 70). Eine gemischte Zahl muss nicht ergänzt werden. Beim Bündeln werden 10 bis 100 Einer in Zehnerpakete und übrige Einer zerlegt, mit zwei separaten Eingabefeldern. Alle Übungsarten sind auch einzeln auswählbar. Zehn richtige Aufgaben ergeben zehn Sonnen. Beliebig viele Versuche, keine Zeitbegrenzung, keine Strafe. Bildschirmtastatur oder normale Zahleneingabe. Tipps erklären das Auffüllen zum nächsten Zehner oder das Zerlegen der zweiten Zahl. Ein Wechsel der Reiseroute startet eine neue Runde.

`plusreise/regeln.mjs` erzeugt Aufgaben und Tipps; `spiel.mjs` steuert Eingabe, Fortschritt und Rundenauswertung.


### Großes Vampirabenteuer

19 Vampire und 14 Mondsteine im 4400 Pixel großen Garten. Im Schloss stehen zwei Hängebrücken zur Auswahl: Mondbrücke oben und Sternbrücke unten. Eine Brücke muss vollständig überquert werden, bevor die Falltür freigegeben wird. Der Keller ist 5600 Pixel lang: 19 Vampire, acht Mondsteine und vier Schlüssel. An der Leiter werden die eingesammelten Schlüssel per Bildschirmknopf ausprobiert. Ein zufälliger Schlüssel passt; falsche Versuche kosten nichts. Nach allen Funden und dem Aufschließen mit ↑ klettern. Im Turm warten 16 weitere Vampire und zwei Turmwachen und acht Zaubersteine. Der Obervampir und der Heimflug bleiben erhalten.


### Lottas Blick und Gespräche

Das Vampirspiel wird nun aus Lottas eigener Perspektive gespielt: ↑ / W vorwärts, ↓ / S zurück, ← / → oder A / D seitwärts. Die Kamera schaut immer zum Kapitelziel. Eine Fundanzeige hilft bei Gegenständen neben oder hinter Lotta. Mondbrücke liegt links, Sternbrücke rechts. Vampire bewachen den gesamten Wegabschnitt; erst ein Gespräch mit zwei Antwortschritten gibt den Weg frei. Antworten per Bildschirmknopf oder 1 / 2. Während eines Gesprächs steht die Spielwelt still. Bereits angesprochene Vampire bleiben freundlich und halten Lotta nicht erneut auf. Auch die Flügel bekommt sie in einem Gespräch mit dem Obervampir.


### Drei Kellertüren

Nach dem Schlüssel und einer vollständig überquerten Hängebrücke fällt Lotta durch die Falltür. Erst unten im Keller-Vorraum stehen drei Eingänge zur Auswahl. Auswahl per Knopf oder Taste 1 / 2 / 3. Nur ein zufällig gewählter Eingang führt weiter in den langen Keller. Die beiden anderen führen nach draußen: Alle Funde und Gespräche werden zurückgesetzt; weiter geht es wieder am Anfang des Gartens. Die richtige Tür bleibt bei diesen Fehlversuchen an derselben Stelle, damit sich Kinder falsche Türen merken können. Eine neue Partie nach dem Ende lost sie neu aus.


### Eingänge nach der Falltür und Turmwachen

Aktueller Ablauf: erst die Brücke überqueren, dann durch die Falltür auf Heu fallen. Danach sieht Lotta aus ihrer Ich-Perspektive drei Eingänge im Keller-Vorraum. Nur einer führt weiter; die beiden anderen setzen alle Funde und Gespräche auf den Anfang des Gartens zurück. Vor dem Obervampir stehen zusätzlich zwei ausdrücklich benannte Turmwachen. Beide müssen in je zwei Antwortschritten angesprochen werden, bevor Lotta den Obervampir erreichen kann.


### Lotta hat Angst

Lotta zeigt bei Vampirbegegnungen Angst: Gedanken vor dem Gespräch, vorsichtige Antworten, eine Herzklopfen-Anzeige und leicht zitternde Hände in der Ich-Perspektive. Während des Gesprächs beruhigt sie sich schrittweise; nach dem Abschied atmet sie auf. Vampire antworten beruhigend. Die Falltür erschreckt sie ebenfalls. Die Angst verursacht keine zusätzlichen Strafen oder verlorene Gegenstände.


### 19 Vampire in jedem Level

Garten, Brückensaal, Keller und Heimflug enthalten je 19 Vampire mit Gesprächen. Im Turm sind es 16 normale Vampire, zwei Turmwachen und der Obervampir – insgesamt ebenfalls 19. Die Brücken-Vampire stehen vor und hinter der Schlucht; beide Brücken bleiben begehbar.


### Aktuelle Kamera und Begegnungen

Die Kamera sitzt jetzt leicht erhöht hinter Lotta. Ihre vollständige Rückenansicht mit langen Haaren, Kleid und Füßen ist im unteren Bildbereich sichtbar und bewegt sich beim Lenken seitlich. Die alten Haare am Bildschirmrand und losgelösten Hände wurden entfernt. Projektion und Begegnung nutzen dieselben Weltpositionen. Ein Gespräch beginnt erst bei höchstens 32 Pixeln Abstand entlang des Weges und 26 Pixeln seitlichem Abstand. Es gibt keine Sperrlinie quer über den Weg; normalen Vampiren darf man seitlich ausweichen. Bereits besprochene Vampire lösen kein weiteres Gespräch aus. Die zwei Turmwachen bleiben verpflichtend: Erst nach beiden Gesprächen kann der Obervampir die Flügel schenken.


## Lana im Labyrinth

https://ghalmets.github.io/webdevprojects/lana-keksflucht/

Neues eigenständiges Spiel mit Kamera leicht oberhalb hinter Lana. Lange mittelbraune Haare, rotes Kleid mit Blumen und lila Sandalen. Vier Pfeiltasten / W A S D oder Bildschirmtasten bewegen die Figur durch drei zufällig generierte, zunehmend größere Labyrinthe. Jedes enthält Sonnentor, Blumentor und Mondtor; alle drei müssen entdeckt werden. Gefundene Tore bleiben markiert, danach geht es wieder hinein und zu den anderen Ausgängen. M / „Karte“ blendet eine vollständige Übersicht ein. Ohne Zeitlimit oder Lebensverlust; Pause mit P / Escape. Hecken direkt vor Lana werden transparent, damit die Figur sichtbar bleibt.

`regeln.mjs` erzeugt die Labyrinthe und prüft Bewegungen; `spiel.mjs` zeichnet die Welt und steuert Tore und Runden.


### Lanas Keks-Flucht

Lana hat einen Keks geklaut und flieht zunächst durch Omis Gartenlabyrinth. Danach folgt der dunkle Friedhof und ein letzter Friedhofsabschnitt. Omi verfolgt sie in allen drei Etappen mit echter Wegsuche durch die begehbaren Zellen und bleibt langsamer als Lana. Vier Sekunden Vorsprung am Start. Wird Lana eingeholt, gibt es einen neuen Versuch im selben Labyrinth; bereits entdeckte Tore bleiben gespeichert. Drei verschiedene Tore pro Abschnitt. Auf dem Friedhof helfen Laternenlicht, Nordpfeil, Keks-Spuren und Karte. Während die Karte offen ist, pausiert die gesamte Verfolgung. Auf der Karte: Rot ist Lana, Lila ist Omi. Am Ende wartet Lana am sicheren Tor auf Omi und teilt die übrigen Kekse.

Die Keks-Flucht hat eine eigene Adresse `/lana-keksflucht/`. Der frühere Link `/lana-labyrinth/` leitet dorthin weiter.


## Mathewerkstatt 4 – Volksschule

https://ghalmets.github.io/webdevprojects/mathe-4/

Eigenständiges Mathematikprogramm für die 4. Klasse, Zahlenraum wählbar bis 10.000 / 100.000. Schriftliche Addition und Subtraktion im Stellenraster mit freiwilliger Hilfszeile. Mehrstellige Multiplikation (dreistellig mal zweistellig) mit zwei Teilprodukt-Zeilen und Gesamtergebnis. Division ohne Rest. Umfang von Rechtecken und Quadraten in cm mit beschrifteten schematischen Zeichnungen. 10er-/100er-Zahlenfolgen vorwärts und rückwärts. Zahlenschreibweise als Stellenwerte, Zahlwörter und Ziffern. Jede Runde hat zehn Aufgaben und genau eine Sachaufgabe am Schluss, auch bei gezielter Themenwahl. Tipps und ausgearbeitete Rechenwege sind jederzeit nutzbar, ohne Punktabzug. Keine Zeitbegrenzung. Optional ausklappbare Bildschirmtastatur.

`mathe-4/regeln.mjs` erzeugt Aufgaben und Rechenwege; `app.mjs` steuert Stellenraster, Eingaben und Fortschritt.


### Drei Leben, zwei Lottas und echter Heimflug

Jedes Kapitel startet mit drei Herzen. Kontakt mit einem normalen Vampir oder Abrutschen von einer Brücke kostet ein Herz; Turmwachen-/Obervampirgespräche und die geplante Falltür kosten keines. Kurze Schutzzeit nach einem Treffer. Bei null Herzen wird nur das aktuelle Kapitel neu gestartet. Die frühere Regel für falsche Kellereingänge bleibt: kompletter Neustart im Garten.

Unten stehen zwei Lotta-Varianten zur Wahl (fliederfarbenes Kleid mit Schleife / mintfarbenes Kleid mit Haarspange). Die Auswahl bleibt über Kapitel und Wiederholungen erhalten. Der letzte Abschnitt ist ein Flug mit automatischer Vorwärtsbewegung, sichtbarem Abstand zum Boden, Schatten und Flügelschlag. ↑ steigen, ↓ sinken, ← / → seitlich steuern. Die 19 Vampire fliegen ebenfalls auf unterschiedlichen Höhen. Kollisionen zählen nur bei räumlicher Nähe und ähnlicher Höhe; keine Gespräche während des Flugs. Rechts vor dem Haus landet Lotta automatisch.


### Vier Freundinnen zur Auswahl

Die Figurenauswahl bietet jetzt Lea (fliederfarbenes Kleid), Luna (mintfarbenes Kleid), Lilly (rosa Kleid) und Hanna (blaues Kleid). Jede hat ein eigenes Porträt und eine passende Rückenansicht im Spiel. Der gewählte Name erscheint in Gesprächen, Gedanken, Bildschirmbeschriftung und Abschluss. Die Wahl bleibt über Kapitel und Wiederholungen erhalten. Drei Leben und der echte Höhenflug bleiben erhalten.


### Individuelle Outfits der Freundinnen

Lea: gelbes Kleid, lila Sandalen, lange mittelbraune Haare. Lilly: grüne Hose, braunes T-Shirt, braune Schuhe, blonde schulterlange Haare. Luna: wuschelige schwarze Haare, dunkle Haut, dunkelblaues T-Shirt, schwarzer Rock (keine Jeans), braune Schuhe. Hanna: gepunktete Leggings, weißes T-Shirt mit Einhornmotiv, weiße Schuhe, mittelbraune Haare. Porträts und Rückenansichten verwenden jeweils passende Kleidung, Haare und Hautfarben. Alle vier sind gleich spielbar.

Aktuelle Spielfiguren: Lea, Luna, Lilly und Hanna ersetzen Lotta vollständig. Alle Gespräche und Kapitel verwenden den Namen der ausgewählten Freundin.
