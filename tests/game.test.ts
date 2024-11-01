import {CooperativeQueen, FightQueen, MathQueenGame} from "../app/game";
import * as aufgaben from '../jsons/aufgaben.json';

describe("Cooperative Game Tests", () => {
    let cooperativeGame: CooperativeQueen;

    beforeEach(() => {
        cooperativeGame = new CooperativeQueen(0, 0, 5, undefined, undefined);
    });

    test("should initialize with correct aufgabe item or default", () => {
        const defaultGame = new CooperativeQueen(1000, 0, 0, undefined, undefined); // Invalid aufgabeParam
        expect(cooperativeGame.aufgabeItem.value).toBe(0);
        expect(defaultGame.aufgabeItem.value).toBe(aufgaben[MathQueenGame.PLAYER1].value);
    });

    test("should identify game modes and multiplayer correctly", () => {
        expect(cooperativeGame.modeNumber).toBe(0); // Cooperative mode
        expect(cooperativeGame.isMultiplayerGame()).toBe(false);
    });

    test("should calculate and update points correctly in Cooperative mode", () => {
        cooperativeGame.winPoint(MathQueenGame.PLAYER1);
        expect(cooperativeGame.getPoints(MathQueenGame.PLAYER1)).toBe(6);

        cooperativeGame.loosePoint(MathQueenGame.PLAYER1);
        expect(cooperativeGame.getPoints(MathQueenGame.PLAYER1)).toBe(5);

        expect(cooperativeGame.getPointsMessage(MathQueenGame.PLAYER1)).toContain("Player: 1 hat 5 Punkte von 10");
    });

    test("should handle task completion check correctly", () => {
        expect(cooperativeGame.hatNochAufgaben()).toBe(true);

        const completedGame = new CooperativeQueen(9, 0, 5, undefined, undefined);
        expect(completedGame.hatNochAufgaben()).toBe(false);
    });
});

describe("Fight Game Tests", () => {
    let fightGame: FightQueen;

    beforeEach(() => {
        fightGame = new FightQueen(10, 1, 3, 2, 1);
    });

    test("should initialize with correct aufgabe item or default", () => {
        const defaultGame = new FightQueen(1000, 1, 0, 0, 0); // Invalid aufgabeParam
        expect(fightGame.aufgabeItem.value).toBe(10);
        expect(defaultGame.aufgabeItem.value).toBe(0);
    });

    test("should identify game modes and multiplayer correctly", () => {
        expect(fightGame.modeNumber).toBe(1); // Fight mode
        expect(fightGame.isMultiplayerGame()).toBe(true);
        expect(fightGame.isPlayerActive(MathQueenGame.PLAYER2)).toBe(true);
    });

    test("should calculate and update points correctly in Fight mode", () => {
        fightGame.winPoint(MathQueenGame.PLAYER1); // Player 1
        expect(fightGame.getPoints(MathQueenGame.PLAYER1)).toBe(4);

        fightGame.loosePoint(MathQueenGame.PLAYER2); // Player 2
        expect(fightGame.getPoints(MathQueenGame.PLAYER2)).toBe(1);

        fightGame.winPoint(MathQueenGame.PLAYER3); // Player 3
        expect(fightGame.getPoints(MathQueenGame.PLAYER3)).toBe(2);

        expect(fightGame.getPointsMessage(MathQueenGame.PLAYER1)).toContain("Player: 1 hat 4 Punkte von 10");
        expect(fightGame.getPointsMessage(MathQueenGame.PLAYER2)).toContain("Player: 2 hat 1 Punkte von 10");
        expect(fightGame.getPointsMessage(MathQueenGame.PLAYER3)).toContain("Player: 3 hat 2 Punkte von 10");
    });

    test("should lock player input after first response", async () => {
        const result = fightGame.onPlayerInput(fightGame.aufgabeItem.loesung, MathQueenGame.PLAYER1);
        expect(result).toBe("success");

        const ignoredResult = fightGame.onPlayerInput(1, MathQueenGame.PLAYER2);
        expect(ignoredResult).toBe("ignore");
    });

    test("should handle task completion check correctly", () => {
        expect(fightGame.hatNochAufgaben()).toBe(true);

        const completedGame = new FightQueen(19, 1, 3, 2, 1);
        expect(completedGame.hatNochAufgaben()).toBe(false);
    });
    test("should handle active player correctly", () => {
        const defaultGame = new FightQueen(1000, 1, 0, undefined, undefined); // Invalid aufgabeParam
        expect(defaultGame.isPlayerActive(MathQueenGame.PLAYER1)).toBe(true);
        expect(defaultGame.isPlayerActive(MathQueenGame.PLAYER2)).toBe(false);
        expect(defaultGame.isPlayerActive(MathQueenGame.PLAYER3)).toBe(false);
    });
});