const fs = require("fs");

function powerLevel(x, y, grid) {
    const rackId = x + 10;
    let level = rackId * y;
    level += grid;
    level *= rackId;
    level = (level/100|0)%10;
    level -= 5;
    return level;
}

function buildGrid(grid) {
    let gridValues = new Array(300 * 300).fill(0);
    for (let x = 0; x < 300; x++) {
        for (let y = 0; y < 300; y++) {
            let i = y * 300 + x;
            gridValues[i] = powerLevel(x+1, y+1, grid);
        }
    }
    return gridValues;
}

function index(x,y) {
    return (y-1) * 300 + (x-1);
}

function findBestSquare(grid) {
    let gridValues = buildGrid(grid);
    let bestTotal = Number.NEGATIVE_INFINITY, bestX, bestY;
    for (let y = 1; y <= 297; y++) {
        for (let x = 1; x <= 297; x++) {
            let total = 0;
            for (let a = 0; a < 3; a++) {
                for (let b = 0; b < 3; b++) {
                    total += gridValues[index(x+b, y+a)];
                }
            }
            if (total > bestTotal) {
                bestTotal = total;
                bestX = x;
                bestY = y;
            }
        }
    }
    return `${bestX},${bestY}: ${bestTotal}`;
}

const testCellInput = [
    { x: 3, y: 5, grid: 8, level: 4 },
    { x: 122, y: 79, grid: 57, level: -5 },
    { x: 217, y: 196, grid: 39, level: 0 },
    { x: 101, y: 153, grid: 71, level: 4 }
];
for (const cellInput of testCellInput) {
    const result = powerLevel(cellInput.x, cellInput.y, cellInput.grid);
    console.log(`${cellInput.x},${cellInput.y} in ${cellInput.grid} expected ${cellInput.level} actual: ${result} ${result === cellInput.level ? "SUCCESS" : "FAILED" }`);
}

const testInput = [
    { input: 18, expected: "33,45: 29" },
    { input: 42, expected: "21,61: 30" }
];
for (const input of testInput) {
    const result = findBestSquare(input.input);
    console.log(`Grid ${input.input} expected ${input.expected} actual ${result} ${result === input.expected ? "SUCCESS" : "FAILED"}`);
}

const input = 7139;
console.log("Solution: ", findBestSquare(input));
