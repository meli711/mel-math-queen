// Import or define your JSON data
import * as aufgaben from "../jsons/aufgaben.json";


// Function to evaluate a math expression string (e.g., "2 + 3")
function evaluateExpression(expression) {
    return Function(`"use strict"; return (${expression})`)();
}

// Function to validate a question's answer
function isCorrectAndUniqueSolution(question) {
    console.log(question.aufgabe)
    console.log(question.loesungen)
    console.log(question.loesung)
    const correctAnswer = evaluateExpression(question.aufgabe);
    const solutionAnswer = evaluateExpression(question.loesungen[question.loesung]);
    const otherSolutions = [];
    for (let i = 0; i < 4; i++) {
        if (question.loesung !== i) {
            otherSolutions.push(evaluateExpression(question.loesungen[i]));
        }
    }
    console.log('correctAnswer: ' + correctAnswer)
    console.log('solutionAnswer: ' + solutionAnswer)
    return correctAnswer === solutionAnswer && otherSolutions.every(sol => sol !== correctAnswer);
}

// Jest test suite
describe("Math Quiz Tests of the json", () => {
    aufgaben.forEach((question, index) => {
        test(`Question ${index + 1}: ${question.aufgabe}`, () => {
            if (question.aufgabentyp === 'Addition' ||
                question.aufgabentyp === 'Subtraktion' ||
                question.aufgabentyp === 'Multiplikation' ||
                question.aufgabentyp === 'Division' ||
                question.aufgabentyp === 'Brüche' ||
                question.aufgabentyp === 'Arithmetik'
            ) {
                expect(isCorrectAndUniqueSolution(question)).toBe(true);
            }
        });
    });
});
