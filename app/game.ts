import * as aufgaben from "../jsons/aufgaben.json";

type AufgabeItem = {
    aufgabentyp: string
    aufgabe: string;
    loesungen: string[];
    loesung: number;
    value: number;
};

/**
 * Spiellogik
 */
export abstract class MathQueenGame {
    //Konstanten
    public static PLAYER1 = 0;
    public static PLAYER2 = 1;
    public static PLAYER3 = 2;
    //Lock damit nur ein Spieler zur gleichen Zeit die richtige Antwort geben kann.
    private playerLock: boolean = false;
    //Alle Url Parameter die ausgelesen werden um das Spiel konsistent zu halten
    private _aufgabeNumber: number;
    private _modeNumber: number;
    private _aufgabeItem: AufgabeItem;
    protected _player1Score: number;
    protected _player2Score: number;
    protected _player3Score: number;

    constructor(aufgabeParam, modeParam, player1Param, player2Param, player3Param) {
        this._aufgabeNumber = aufgabeParam;
        this._modeNumber = modeParam;
        this._player1Score = player1Param;
        this._player2Score = player2Param;
        this._player3Score = player3Param;
        //die Aufgabe wird im json anhand des index gesucht. Wenn es sie nicht gibt, wird aufgabe=0 verwendet.
        this._aufgabeItem = aufgaben.find(x => x.value == aufgabeParam) || aufgaben[0];
    }

    //getters
    public get modeNumber() {
        return this._modeNumber;
    }

    get aufgabeNumber() {
        return this._aufgabeNumber;
    }

    get aufgabeItem(): AufgabeItem {
        return this._aufgabeItem;
    }

    public isTwoPlayerGame() {
        return this._player2Score !== undefined;
    }

    public isThreePlayerGame() {
        return this._player3Score !== undefined;
    }

    public isMultiplayerGame() {
        return this._player2Score !== undefined || this._player3Score !== undefined;
    }

    /**
     * Wird von Maus aus Keyboard Input aufgerufen.
     * @param input: Der Tip (index) auf die Lösung
     * @param player: Der Spieler der den Tip abgibt
     */
    public onPlayerInput(input: number, player: number): string {
        if (this.playerLock) {
            return "ignore"
        }
        this.playerLock = true;
        if (this._aufgabeItem.loesung === input) {
            this.winPoint(player);
            //player lock bleibt bestehen bis zur nächsten Aufgabe
            return "success";
        } else {
            this.loosePoint(player);
            this.playerLock = false;
            return "failure";
        }
    }

    isPlayerActive(player: number): boolean {
        switch (player) {
            case MathQueenGame.PLAYER1:
                return true;
            case MathQueenGame.PLAYER2:
                return this._player2Score !== undefined;
            case MathQueenGame.PLAYER3:
                return this._player3Score !== undefined;
            default:
                return false;
        }
    }

    hatNochAufgaben() {
        //Die Aufgaben beginnen bei 0,10,20,30,etc. Nach 10 Aufgaben ist das Quizz zu Ende.
        return (this._aufgabeNumber + 1) % 10 !== 0;
    }

    /**
     * richtige antwort, dem Spieler wird ein Punkt gutgeschrieben
     * @param player
     */
    abstract winPoint(player: number): void

    /**
     * richtige antwort, dem Spieler wird ein Punkt abgezogen
     * @param player
     */
    abstract loosePoint(player: number): void

    /**
     * liefert die Punkte für einen Spieler
     * @param player
     */
    abstract getPoints(player: number): number

    /**
     * Liefert den Text für die Reultatübersicht
     * @param player
     */
    abstract getPointsMessage(player: number): string

    /**
     * Liefert ob der Spieler der Gewinner ist
     * @param player
     */
    abstract isWinner(player: number): boolean

}

export class CooperativeQueen extends MathQueenGame {

    private playerScore: number

    constructor(aufgabeParam, modeParam, player1Param, player2Param, player3Param) {
        super(aufgabeParam, modeParam, player1Param, player2Param, player3Param);
        this.playerScore = this._player1Score;
    }

    loosePoint(player: number) {
        this.playerScore--;
    }

    winPoint(player: number) {
        this.playerScore++;
    }

    getPoints(player: number): number {
        return this.playerScore;
    }

    getPointsMessage(player: number): string {
        if (this.isMultiplayerGame()) {
            return "Die Spieler haben " + this.playerScore + " Punkte von 10";
        } else {
            return "Player: " + (player + 1) + " hat " + this.playerScore + " Punkte von 10";
        }
    }

    isWinner(player: number): boolean {
        return true;// Cooperation is always the winner
    }
}

export class FightQueen extends MathQueenGame {
    private playerScore: number[] = [];

    constructor(aufgabeParam, modeParam, player1Param, player2Param, player3Param) {
        super(aufgabeParam, modeParam, player1Param, player2Param, player3Param);
        this.playerScore.push(this._player1Score);
        if (this.isPlayerActive(MathQueenGame.PLAYER2)) {
            this.playerScore.push(this._player2Score);
        }
        if (this.isPlayerActive(MathQueenGame.PLAYER3)) {
            this.playerScore.push(this._player3Score);
        }
    }

    loosePoint(player: number) {
        this.playerScore[player] = this.playerScore[player] - 1;
    }

    winPoint(player: number) {
        this.playerScore[player] = this.playerScore[player] + 1;
    }

    getPoints(player: number): number {
        return this.playerScore[player] ?? -1000;
    }

    getPointsMessage(player: number): string {
        return "Player: " + (player + 1) + " hat " + this.playerScore[player] + " Punkte von 10";
    }

    isWinner(player: number): boolean {
        switch (player) {
            case MathQueenGame.PLAYER1:
                return this.getPoints(MathQueenGame.PLAYER1) > this.getPoints(MathQueenGame.PLAYER2) &&
                    this.getPoints(MathQueenGame.PLAYER1) > this.getPoints(MathQueenGame.PLAYER3)
            case MathQueenGame.PLAYER2:
                return this.getPoints(MathQueenGame.PLAYER2) > this.getPoints(MathQueenGame.PLAYER1) &&
                    this.getPoints(MathQueenGame.PLAYER2) > this.getPoints(MathQueenGame.PLAYER3)
            case MathQueenGame.PLAYER3:
                return this.getPoints(MathQueenGame.PLAYER3) > this.getPoints(MathQueenGame.PLAYER1) &&
                    this.getPoints(MathQueenGame.PLAYER3) > this.getPoints(MathQueenGame.PLAYER2)
            default:
                return false;
        }
    }
}