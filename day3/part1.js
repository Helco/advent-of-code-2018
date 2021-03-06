const fs = require("fs");
const PATTERN = /\#(\d+) \@ (\d+),(\d+): (\d+)x(\d+)/
const SIZE = 1000;

function clearId(map, id) {
    for (var i = 0; i < map.length; i++) {
        if (map[i] === id)
            map[i] = 'x';
    }
}

function drawClaim(map, claim) {
    var didOverlap = 0;
    for (var x = claim.x; x < claim.x + claim.w; x++) {
        for (var y = claim.y; y < claim.y + claim.h; y++) {
            var cell = (y * SIZE) + x;
            if (map[cell] === 'x') {
                continue;
            }
            else if (map[cell] > 0) {
                didOverlap++;
                clearId(map, map[cell]);
                map[cell] = 'x';
            }
            else
                map[cell] = claim.id;
        }
    }
    return didOverlap;
}

function extractClaim(line, claim) {
    const results = PATTERN.exec(line);
    claim.id = results[1];
    claim.x = +results[2];
    claim.y = +results[3];
    claim.w = +results[4];
    claim.h = +results[5];
}

function countOverlaps(list) {
    const map = new Array(SIZE * SIZE);
    let count = 0;
    let claim = {};
    for (const line of list) {
        extractClaim(line, claim);
        count += drawClaim(map, claim);
    }
    return count;
}

const textInput = [
    "#1 @ 1,3: 4x4",
    "#2 @ 3,1: 4x4",
    "#3 @ 5,5: 2x2"
];

console.log("Test count: " + countOverlaps(textInput));

const input = fs.readFileSync("./input.txt", "utf8").split("\n");
console.log("Count: " + countOverlaps(input));
