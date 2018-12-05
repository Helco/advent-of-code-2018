const fs = require("fs");

function countReducedChars(input) {
    let nextInput = input;
    let didSomething = true;
    while(didSomething) {
        didSomething = false;
        input = nextInput;
        nextInput = "";
        for (const ch of "abcdefghijklmnopqrstuvwxyz") {
            const ch2 = ch.toUpperCase();
            const i1 = input.indexOf(ch +ch2);
            if (i1 >= 0) {
                input = input.slice(0, i1) + input.slice(i1+2);
                didSomething = true;
                break;
            }
            const i2 = input.indexOf(ch2 +ch);
            if (i2 >= 0) {
                input = input.slice(0, i2) + input.slice(i2+2);
                didSomething = true;
                break;
            }
        }
        nextInput = input;
    }
    return nextInput.length;
}

const testInput = "dabAcCaCBAcCcaDA";

console.log("Actual:  ", countReducedChars(testInput));
console.log("Expected: 10");

console.log("Solution: ", countReducedChars(fs.readFileSync("input", "utf8").trim().replace(/[\n\r]/g, "")));
