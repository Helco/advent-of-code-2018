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

function countWithBestDeleted(input) {
    let best = -1;
    for (const ch of "abcdefghijklmnopqrstuvwxyyz") {
        const regex = new RegExp("[" + ch + ch.toUpperCase() + "]", "g");
        let curInput = input.replace(regex, "");
        const curCount = countReducedChars(curInput);
        if (best < 0 || curCount < best)
            best = curCount;
    }
    return best;
}

const testInput = "dabAcCaCBAcCcaDA";

console.log("Actual:  ", countWithBestDeleted(testInput));
console.log("Expected: 4");

console.log("Solution: ", countWithBestDeleted(fs.readFileSync("input", "utf8").trim().replace(/[\n\r]/g, "")));
