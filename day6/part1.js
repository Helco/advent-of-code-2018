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
        gridOrigin: [ min[0] - 1, min[1] - 1 ],
        gridSize: [ max[0] - min[0] + 3, max[1] - min[1] + 3 ]
    };
}

function manhattan(a, b) {
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

function biggestFiniteArea(input) {
    const points = extractPoints(input);
    const { gridOrigin, gridSize } = findGrid(points);
    const pointMap = new Array(gridSize[0] * gridSize[1]).fill(-1);
    const distMap = new Array(gridSize[0] * gridSize[1]).fill(Number.POSITIVE_INFINITY);

    // on error maybe reverse
    for (let pointI = 0; pointI < points.length; pointI++) {
        const point = points[pointI];
        for (let cellI = 0; cellI < pointMap.length; cellI++) {
            const cellPos = [
                gridOrigin[0] + (cellI % gridSize[0]),
                gridOrigin[1] + Math.floor(cellI / gridSize[0])];
            const dist = manhattan(cellPos, point);
            if (dist < distMap[cellI]) {
                pointMap[cellI] = pointI;
                distMap[cellI] = dist;
            }
            else if (dist == distMap[cellI])
                pointMap[cellI] = -1;
        }
    }

    let best = -1, bestCount = -1;
    for (let pointI = 0; pointI < points.length; pointI++) {
        let curCount = 0;
        for (let cellI = 0; cellI < pointMap.length; cellI++) {
            const cellPos = [
                gridOrigin[0] + (cellI % gridSize[0]),
                gridOrigin[1] + Math.floor(cellI / gridSize[0])];
            if (pointMap[cellI] == pointI) {
                if (cellPos[0] == 0 || cellPos[0] == gridSize[0] - 1 ||
                    cellPos[1] == 0 || cellPos[1] == gridSize[1] - 1) {
                        curCount = -1;
                        break;
                    }
                curCount++;
            }
        }
        if (curCount > bestCount) {
            best = pointI;
            bestCount = curCount;
        }
    }

    return bestCount;

}

const testInput = [
    "1, 1",
    "1, 6",
    "8, 3",
    "3, 4",
    "5, 5",
    "8, 9"
];

console.log("Expected: 17");
console.log("Actual:  ", biggestFiniteArea(testInput));
console.log("Solution: ", biggestFiniteArea(fs.readFileSync("input", "utf8").split("\n")));
