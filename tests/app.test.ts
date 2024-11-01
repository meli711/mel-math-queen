import {CooperativeQueen, FightQueen, MathQueenGame} from "../app/game";
import {delay} from "../app/app";

test("delay should pause execution for specified milliseconds", async () => {
    const start = Date.now();
    await delay(200);
    const end = Date.now();
    expect(end - start).toBeGreaterThanOrEqual(200);
});

// Alle anderen Funktionen sind zu schwierig um automatisch zu testen und werden manuel getestet.