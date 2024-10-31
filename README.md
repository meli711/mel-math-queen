# math-queen
Description:
* Improve your math skills with this fun game – now also available in multiplayer!

Installation:

* Install Node (also all subpackages like python): https://nodejs.org/en/download/package-manager
* checkout the code: https://github.com/meli711/math-queen


In Project root (where the package.json is) open a terminal:
* npm install
* npm run build:dev
* npm start (in a second terminal)
* browse: http://localhost:8080
* select quizz, player, mode and start the game
* player1 plays with the mouse
* player2 plays with the keyboard: w=>answer top left,e=>answer top right,s=>answer bottom left,d=>answer bottom right 
* player3 plays with the keyboard: i=>answer top left,o=>answer top right,k=>answer bottom left,l=>answer bottom right 
* cooperativ: the points from every player count together
* fight: every player has its own points and there may be a winner at the end.
* To test the software, enter in terminal:  npm run test

Game:
Architektur:
* Programiersprache: Typescript, weil einfach (einfacher als Javascript) und ideal für Web und somit auf fast allen Geräten spielbar.
* Datenhaltung: Json, weil sehr gut integriert in Typescript
* User Interface: Html und CSS. Html weil einfach und CSS für das Styling kann chatgpt machen.
* Entwicklungsumgebung: IntelliJ Community, weil gratis und gut
* Runtime: Node weil das die Runtime von Javascript ist
* Build: Npm und webpack um das ganze zu builden und zu verpacken
* Github als Versionierung weil gut und gratis.

Design:
* Eine Html-Seite als Startseite (index.html) um das Spiel zu konfigurieren. Ohne Styling
* Eine Httml-Seite für das Spiel (game.html) um das Spiel zu spielen und die Resultate anzuzeigen. Ohne Styling
* Ein Styling für die Startseite: index.css
* Ein Styling für das Game: game.css
* Datenhaltung: aufgaben.json enthält alle Aufgabe, vier mögliche Lösungen und die richtige Lösung.
* Der Typescript Code wird zu Javascript interpretiert und mit webpack im game.html eingebetet
    - app.ts: Verbindung der Html Seite zum Spiel, navigation, Benutzereingaben
    - game.ts: Spiellogik
* Jede Aufgabe, der gewählte Modus, der Spielstand des oder der Spieler ist in der URL abgebildet. Immer wenn eine Aufgabe korrekt gelöst wurde, navigiert das System und das Spiel initialisiert sich neu.
* Das Json aufgaben.json und die Spiellogik (game.ts) werden mit Jest getestet. App.ts wird manuel getestet, weil es zu kompliziert ist um es zu testen.
* Das Spiel wird in Englisch geschrieben, auch, Fachbegriffe auf Deutsch. Z.B. Aufgabe, Loesung, etc..
* Die Spiellogik von Kooperativ und Fight werden objektorientiert implemetiert.

Spiellogik:
* Ein Quiz hat 10 Fragen mit jeweils 4 möglichen Antworten.
* Es können 1-3 Spieler teilnehmen.
* Spieler1 ist obligatorisch.
* Das Spiel initialisiert sich bei falschen Parametern automatisch als 1 Spieler, Modus=kooperativ, Aufgabe=0
* Die Spieler können zusammen Punkte sammeln (kooperativ) oder gegeneinander antreten (Fight).
* Jede falsche Antwort gibt minus ein Punkt.
* Spieler können auch minus Punkte haben.
* Nur ein Spieler kann die richtige Antwort pro Frage liefern (lock)
* Sobald die Lösung korrekt ist, wird zu nächsten Frage navigiert
* Wenn 10 Fragen korrekt beantwortet wurden geht es zur Auswertung
* Die Auswertung unterscheidet zwischen kooperativ und fight. Ein Spieler und Mehrspieler
* Wenn die Auswertung geschlossen wird, gelangt man automatisch zum Spielstart.

Beispiele:
* index.html, in einem Formular werden die Parameter ausgewählt. Parameter sind: player1, player2,player3, modus(0=kooperativ, 1=fight), und die Aufgabennummer (Quiz1=0,Quiz2=10,Quiz3=20,Quiz4=30). Ein Quiz beinhaltet 10 Fragen. player1 ist obligatorisch, player2 und 3 fakultativ. Die Werte entsprechen der Punkte, also player1=0 heisst, der Spieler1 hat 0 Punkte.
* game.html?aufgabe=0&player1=0&mode=0  > Aufgabe mit index 0 aus json, player1 hat 0 Punkte, Modus=0 (kooperativ)
* game.html?aufgabe=1&player1=1&mode=0  > Aufgabe mit index 1 aus json, player1 hat 1 Punkt, Modus=0 (kooperativ)
* game.html?aufgabe=2&player1=1&player2=0&mode=1  > Aufgabe mit index 2 aus json, player1 hat 1 Punkt, player2 hat 0 punkte Modus=1 (fight)

Projektplanung, Arbeitspakete
* Architektur festlegen und beschreiben
* Design festlegen und beschreiben
* Spiellogik festlegen und beschreiben
* Software installieren (IntelliJ, Node)
* Projekt Setup erstellen, Projekt in Intellij anlegen, Projektstruktur noch ohne Code erstellen. Das sind: Ordner app, json, tests und Dateien: package.json, tsconfig.json, webpack.config.js,jest.config.js, game.template, app.ts und .gitignore
* Skizze von Game Setup (index.html), Game und Resultate (game.html) erstellen.
* Klassendiagram und Flussdiagram und Datenstruktur(Json) erstellen
* index.html ohne Styling erstellen
* game.html ohne Styling erstellen
* Styling erstellen
* app.ts game.ts implementieren inkl. tests