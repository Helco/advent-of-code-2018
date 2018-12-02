const fs = require("fs");

function areSimilar(word1, word2) {
    var diffCount = 0;
    var resultString = "";
    for (let i = 0; i < word1.length; i++)
    {
        if (word1.charAt(i) === word2.charAt(i))
            resultString += word1.charAt(i);
        else if (++diffCount > 1)
            return false;
    }
    return diffCount === 1 && resultString;
}

function similar(list, prefix) {
    const wordTriplets = [ ];

    for (const word1 of list) {
        for (const word2 of list) {
            const key = areSimilar(word1, word2);
            if (!key)
                continue;
            wordTriplets.push([ word1, word2, key ]);
        }
    }

    for (const triplet of wordTriplets) {
        console.log(`${prefix}${triplet[0]} and ${triplet[1]} so ${triplet[2]}`)
    }
}

console.log("Sanity test");
const testInput = [
    "abcde",
    "fghij",
    "klmno",
    "pqrst",
    "fguij",
    "axcye",
    "wvxyz"
];
similar(testInput, "Actual:  ");
console.log("Expected: fghij and fguij so fgij");
console.log("");

console.log("The real deal");
const input = fs.readFileSync("./input", "utf8").split("\n");
similar(input, "");
