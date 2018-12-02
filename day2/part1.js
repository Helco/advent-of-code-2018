const fs = require("fs");

function countWordsWith(list, letterCount) {
    const ALPHABET = "abcdefghijklmnopqrstuvwxyz";
    var wordCount = 0;
    for (const word of list) {
        const characterCount = {};
        for (const ch of ALPHABET)
            characterCount[ch] = 0;
        for (const ch of word)
            characterCount[ch]++;
        for (const ch of ALPHABET) {
            if (characterCount[ch] === letterCount) {
                wordCount++;
                break;
            }
        }
    }
    return wordCount;
}

function checksum(list, prefix) {
    const twoCount = countWordsWith(list, 2);
    const threeCount = countWordsWith(list, 3);
    const result = twoCount * threeCount;
    console.log(`${prefix || "" }${twoCount} * ${threeCount} = ${result}`);
}

console.log("Example test");
const testInput = [
    "abcdef",
    "bababc",
    "abbcde",
    "abcccd",
    "aabcdd",
    "abcdee",
    "ababab"
];
checksum(testInput, "Actual:  ");
console.log("Expected: 4 * 3 = 12");
console.log("");

console.log("The real deal");
const input = fs.readFileSync("./input", "utf8").split("\n");
checksum(input);
