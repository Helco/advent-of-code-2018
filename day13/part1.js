const fs = require("fs");

const NOPE = 10;
const HOR = 11;
const VER = 12;
const DOWN = 2;
const LEFT = 1;
const INTER = 13;
const CRASH = 14;
const UP = 0;
const RIGHT = 3;

function extractMap(lines) {
    const height = lines.length;
    const width = lines[0].length;
    const map = new Array(width * height).fill(NOPE);
    const trains = [];
    const crashes = [];
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let i = y * width + x;
            switch (lines[y].charAt(x)) {
                case('-'): map[i] = HOR; break;
                case('|'): map[i] = VER; break;
                case('\\'): map[i] = LEFT; break;
                case('/'): map[i] = RIGHT; break;
                case('+'): map[i] = INTER; break;
                case('X'): map[i] = CRASH; crashes.push({ x, y }); break;
                case('<'): map[i] = HOR; trains.push({ x, y, dir: LEFT, idecision: LEFT }); break;
                case('>'): map[i] = HOR; trains.push({ x, y, dir: RIGHT, idecision: LEFT }); break;
                case('^'): map[i] = VER; trains.push({ x, y, dir: UP, idecision: LEFT }); break;
                case('v'): map[i] = VER; trains.push({ x, y, dir: DOWN, idecision: LEFT }); break;
            }
        }
    }
    return {
        width, height, cells: map, trains, crashes: []
    };
}

function changeDir(base, change) {
    return (base + change) % 4;
}

function advanceMap(map) {
    const trains = map.trains.sort((a,b) => {
        if (a.y == b.y)
            return (a.x > b.x) - (a.x < b.x);
        return (a.y > b.y) - (a.y < b.y);
    });
    for (train of trains) {
        if (train.crashed)
            continue;
        let cell = map.cells[train.y * map.width + train.x];
        switch(cell) {
            case(VER): train.y += train.dir == UP ? -1 : 1; break;
            case(HOR): train.x += train.dir == LEFT ? -1 : 1; break;
            case(RIGHT):
                switch(train.dir) {
                    case(UP): train.x++; train.dir = RIGHT; break;
                    case(DOWN): train.x--; train.dir = LEFT; break;
                    case(LEFT): train.y++; train.dir = DOWN; break;
                    case(RIGHT): train.y--; train.dir = UP; break;
                }
                break;
            case(LEFT):
                switch(train.dir) {
                    case(UP): train.x--; train.dir = LEFT; break;
                    case(DOWN): train.x++; train.dir = RIGHT; break;
                    case(LEFT): train.y--; train.dir = UP; break;
                    case(RIGHT): train.y++; train.dir = DOWN; break;
                }
                break;
            case(INTER):
                var globalDir = changeDir(train.dir, train.idecision);
                switch(globalDir) {
                    case(LEFT): train.x--; break;
                    case(RIGHT): train.x++; break;
                    case(UP): train.y--; break;
                    case(DOWN): train.y++; break;
                }
                switch(train.idecision) {
                    case(LEFT): train.idecision = UP; break;
                    case(UP): train.idecision = RIGHT; break;
                    case(RIGHT): train.idecision = LEFT; break;
                }
                train.dir = globalDir;
                break;
            case(CRASH): train.crashed = true; break;
        }
        if (train.crashed)
            continue;
        for (other of trains) {
            if (other != train && other.x == train.x && other.y == train.y) {
                other.crashed = true;
                train.crashed = true;
                map.cells[train.y * map.width + train.x] = CRASH;
                map.crashes.push({ x: train.x, y: train.y });
            }
        }
    }
    //visualize(map);
}

function getTrainAt(map, x, y) {
    for (const train of map.trains) {
        if (train.x === x && train.y === y)
            return train;
    }
    return null;
}

function visualize(map) {
    const CELL_CHARS = {};
    CELL_CHARS[NOPE] = '.';
    CELL_CHARS[HOR] = '-';
    CELL_CHARS[VER] = '|';
    CELL_CHARS[VER] = '|';
    CELL_CHARS[RIGHT] = '/';
    CELL_CHARS[LEFT] = '\\';
    CELL_CHARS[INTER] = '+';
    CELL_CHARS[CRASH] = 'X';
    const TRAIN_CHARS = {};
    TRAIN_CHARS[UP] = '^';
    TRAIN_CHARS[DOWN] = 'v';
    TRAIN_CHARS[LEFT] = '<';
    TRAIN_CHARS[RIGHT] = '>';
    for (let y = 0; y < map.height; y++) {
        let line = "";
        for (let x = 0; x < map.width; x++) {
            let i = y * map.width + x;
            const train = getTrainAt(map, x, y);
            line += train === null
                ? CELL_CHARS[map.cells[i]]
                : TRAIN_CHARS[train.dir];
        }
        console.log(line);
    }
    console.log();
    console.log();
}

function getFirstCrash(input) {
    var map = extractMap(input);
    while(map.crashes.length == 0) {
        advanceMap(map);
    }
    return map.crashes[0].x + "," + map.crashes[0].y;
}

const testInput = [
    "/->-\\        ",
    "|   |  /----\\",
    "| /-+--+-\\  |",
    "| | |  | v  |",
    "\\-+-/  \\-+--/",
    "\\------/     "
];

console.log("Expected: 7,3");
//console.log("Actual:  " + getFirstCrash(testInput));
console.log("Solution: " + getFirstCrash(fs.readFileSync(__dirname + "/input", "utf8").split("\n")));