import {MathQueenGame, CooperativeQueen, FightQueen} from "./game";

const TOP_LEFT = 0;
const TOP_RIGHT = 1;
const BOTTOM_LEFT = 2;
const BOTTOM_RIGHT = 3;
const NOT_ALLOWED = "ignore";
const CORRECT = "success";
const WRONG = "failure";
const MODE_KOOPERARTIV = 0;

let game: MathQueenGame;
let rAufgabe = document.getElementById("rAufgabe");
let rPlayer1 = document.getElementById("rPlayer1");
let rPlayer2 = document.getElementById("rPlayer2");
let rPlayer3 = document.getElementById("rPlayer3");
let rCrownPlayer1 = document.getElementById("rCrownPlayer1");
let rCrownPlayer2 = document.getElementById("rCrownPlayer2");
let rCrownPlayer3 = document.getElementById("rCrownPlayer3");
let rLoesung: HTMLElement[] = [
    document.getElementById("rLoesung0"),
    document.getElementById("rLoesung1"),
    document.getElementById("rLoesung2"),
    document.getElementById("rLoesung3")
];

/**
 * Hilfsfunktion um zu warten
 * @param ms
 */
export function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * navigiert zur nächsten Aufgabe
 */
function navigateToNextAufgabe() {
    //Every Aufgabe is an URL.
    //State of the game are given with Url-Parameter
    var url = new URL(window.location.href);
    var search_params = url.searchParams;
    search_params.set("aufgabe", '' + (game.aufgabeNumber + 1));
    search_params.set("player1", '' + game.getPoints(MathQueenGame.PLAYER1));
    if (game.isPlayerActive(MathQueenGame.PLAYER2)) {
        search_params.set("player2", '' + game.getPoints(MathQueenGame.PLAYER2));
    }
    if (game.isPlayerActive(MathQueenGame.PLAYER3)) {
        search_params.set("player3", '' + game.getPoints(MathQueenGame.PLAYER3));
    }
    url.search = search_params.toString();
    window.location.href = url.href;
}

/**
 * Verarbeitung nach der Benutzereingabe (Maus und der Tastatur).
 * @param loesungNumber
 * @param result
 */
async function afterUserAction(loesungNumber, result) {
    // Highlight the solution with the provided result class
    rLoesung[loesungNumber].classList.add(result);

    switch (result) {
        case NOT_ALLOWED:
            await delay(200);
            // Remove the yellow background after 200ms for not allowed action
            rLoesung[loesungNumber].classList.remove(result);
            break; // player lock, do nothing
        case CORRECT:
            await delay(1000);
            // Move to the next aufgabe or show results if no tasks left
            game.hatNochAufgaben() ? navigateToNextAufgabe() : showResults();
            break;
        case WRONG:
            // Remove the red background after 200ms for wrong choice
            await delay(200);
            rLoesung[loesungNumber].classList.remove(result);
            break;
        default:
            console.warn(`Unknown result type: ${result}`);
    }
}

/**
 * Mausklick des Spieler1
 * @param loesungNumber
 */
export function onLoesungClick(loesungNumber) {
    let result = game.onPlayerInput(loesungNumber, MathQueenGame.PLAYER1);
    afterUserAction(loesungNumber, result);
}

/**
 * Tastatur Eingabe von Spieler2 und 3
 * @param event das events der tastatur mit dem gedrückten Buchstaben
 */

export function onKeyDown(event) {
    const keyMap = {
        'w': {loesungNumber:TOP_LEFT, player:MathQueenGame.PLAYER2},
        'e': {loesungNumber:TOP_RIGHT, player:MathQueenGame.PLAYER2},
        's': {loesungNumber:BOTTOM_LEFT, player:MathQueenGame.PLAYER2},
        'd': {loesungNumber:BOTTOM_RIGHT, player:MathQueenGame.PLAYER2},
        'i': {loesungNumber:TOP_LEFT,player:MathQueenGame.PLAYER3},
        'o': {loesungNumber:TOP_RIGHT,player:MathQueenGame.PLAYER3},
        'k': {loesungNumber:BOTTOM_LEFT,player:MathQueenGame.PLAYER3},
        'l': {loesungNumber:BOTTOM_RIGHT,player:MathQueenGame.PLAYER3}
    };
    const key = event.key.toLowerCase();
    const loesungNumber = keyMap[key]?.loesungNumber;
    const player = keyMap[key]?.player;

    if (loesungNumber !== undefined && player !== undefined && game.isPlayerActive(player)) {
        const result = game.onPlayerInput(loesungNumber, player);
        afterUserAction(loesungNumber, result);
    }
}

/**
 * liest die parameter aus
 * @param name des Parameters
 */
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

/**
 * Zeigt die Resulate (Spielstand) am Schluss des Quizz an.
 */
export function showResults() {
    const overlay = document.getElementById("overlay");
    if (!overlay) {
        return;
    }
    overlay.style.display = "flex"; // Show the modal
    rPlayer1.textContent = game.getPointsMessage(MathQueenGame.PLAYER1)
    if (game.isMultiplayerGame() && game.modeNumber !== MODE_KOOPERARTIV) {
        if (game.isWinner(MathQueenGame.PLAYER1)) {
            rCrownPlayer1.style.display = "block";
        }
    }
    if (game.isPlayerActive(MathQueenGame.PLAYER2) && game.modeNumber !== MODE_KOOPERARTIV) {
        rPlayer2.textContent = game.getPointsMessage(MathQueenGame.PLAYER2);
        if (game.isWinner(MathQueenGame.PLAYER2)) {
            rCrownPlayer2.style.display = "block";
        }
    }
    if (game.isPlayerActive(MathQueenGame.PLAYER3) && game.modeNumber !== MODE_KOOPERARTIV) {
        rPlayer3.textContent = game.getPointsMessage(MathQueenGame.PLAYER3)
        if (game.isWinner(MathQueenGame.PLAYER3)) {
            rCrownPlayer3.style.display = "block";
        }
    }
}

/**
 * Zeigt die Fragen und Antworten im HTML an
 */
export function display() {
    rAufgabe.textContent = game.aufgabeItem.aufgabe;
    rLoesung[TOP_LEFT].textContent = game.aufgabeItem.loesungen[TOP_LEFT];
    rLoesung[TOP_RIGHT].textContent = game.aufgabeItem.loesungen[TOP_RIGHT];
    rLoesung[BOTTOM_LEFT].textContent = game.aufgabeItem.loesungen[BOTTOM_LEFT];
    rLoesung[BOTTOM_RIGHT].textContent = game.aufgabeItem.loesungen[BOTTOM_RIGHT];
}

/**
 * Schliesst die Ergebnisse
 */
export function closeResults() {
    const overlay = document.getElementById("overlay");
    if (overlay) {
        overlay.style.display = "none"; // Hide the modal
    }
    window.location.href = "index.html";
}

/**
 * Liest die parameter und initialisiert das Spiel.
 */
export function initGame() {
    const aufgabeParam = +getUrlParameter('aufgabe');
    const modeParam = getUrlParameter('mode');
    const player1Param = getUrlParameter('player1');
    const player2Param = getUrlParameter('player2');
    const player3Param = getUrlParameter('player3');
    // convert the params to number or default (number or undefined) if not set.
    const aufgabe = aufgabeParam ? +aufgabeParam : 0;
    const mode = modeParam ? +modeParam : 0;
    const player1 = player1Param ? +player1Param : 0;
    const player2 = player2Param ? +player2Param : undefined;
    const player3 = player3Param ? +player3Param : undefined;
    game = (mode === MODE_KOOPERARTIV
        ? new CooperativeQueen(aufgabe, mode, player1, player2, player3)
        : new FightQueen(aufgabe, mode, player1, player2, player3));

    display();
}


/**
 * wird vom game.html geladen
 */
export function onLoad() {
    initGame();
}