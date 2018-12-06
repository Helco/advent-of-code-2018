const fs = require("fs");

function extractPoints(input) {
    return input.map(line => {
        const results = /(\d+), (\d+)/.exec(line);
        return [+results[1], +results[2]];
    });
}

function findGrid(points) {
    let min = [
        Math.min.apply(null, points.map(p => p[0])),
        Math.min.apply(null, points.map(p => p[1]))
    ];
    let max = [
        Math.max.apply(null, points.map(p => p[0])),
        Math.max.apply(null, points.map(p => p[1]))
    ];
    return {
        gridOrigin: [ min[0] - 100, min[1] - 100 ],
        gridSize: [ max[0] - min[0] + 300, max[1] - min[1] + 300 ]
    };
}

function manhattan(a, b) {
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

function measureNearArea(input, max) {
    const points = extractPoints(input);
    const { gridOrigin, gridSize } = findGrid(points);
    const pointMap = new Array(gridSize[0] * gridSize[1]).fill(-1);
    const distMap = new Array(gridSize[0] * gridSize[1]).fill(0);

    // on error maybe reverse
    for (let pointI = 0; pointI < points.length; pointI++) {
        const point = points[pointI];
        for (let cellI = 0; cellI < pointMap.length; cellI++) {
            const cellPos = [
                gridOrigin[0] + (cellI % gridSize[0]),
                gridOrigin[1] + Math.floor(cellI / gridSize[0])];
            const dist = manhattan(cellPos, point);
            distMap[cellI] += dist;
        }
    }

    let count = 0;
    for (const dist of distMap) {
        if (dist < max)
            count++;
    }

    return count;

}

const testInput = [
    "1, 1",
    "1, 6",
    "8, 3",
    "3, 4",
    "5, 5",
    "8, 9"
];

console.log("Expected: 16");
console.log("Actual:  ", measureNearArea(testInput, 32));
console.log("Solution: ", measureNearArea(fs.readFileSync("input", "utf8").split("\n"), 10000));
