const fs = require("fs");

const CELL_WALL = -1;
const CELL_NOPE = -2;

const TYPE_NONE = -1;
const TYPE_ELF = 0;
const TYPE_GOBLIN = 1;

const UP = 0;
const RIGHT = 1;
const DOWN = 2;
const LEFT = 3;

function moveIn(x, y, d) {
    switch(d) {
        case UP: return { x, y: y - 1 };
        case DOWN: return { x, y: y + 1 };
        case LEFT: return { x: x - 1, y };
        case RIGHT: return { x: x + 1, y };
        default: throw new Error("Invalid direction: " + d);
    }
}

function readingSort(a,b) {
    const ai = a.y * this.game.width + a.x;
    const bi = b.y * this.game.width + b.x;
    return (ai > bi) - (ai < bi);
}

class Unit {
    constructor(game, type, x, y) {
        this.game = game;
        this.type = type;
        this.x = x;
        this.y = y;
        this.attack = 3;
        this.hitpoints = 200;
    }

    enemiesInRange() {
        return this.game.neighborHood(this.x, this.y, false)
            .filter(cell => {
                const unit = this.game.unitAt(this.x, this.y);
                return unit !== null && unit.type != this.type
        });
    }

    advance() {
        let enemies = this.enemiesInRange();
        if (enemies.length === 0)
            this.move();
        enemies = this.enemiesInRange();
        if (enemies.length > 0)
            this.game.attack(this, enemiesInRange.sort(readingSort.bind(this))[0]);
    }

    move() {
        const enemyPlaces = this.game.units
            .filter(unit => unit.type !== this.type)
            .map(unit => this.game.neighborHood(unit.x, unit.y, true))
            .reduce((prev, cur) => prev.concat(cur), []);
        const paths = this.game.findPaths(this.x, this.y, enemyPlaces)
            .sort(readingSort.bind(this));
        if (paths.length > 0)
            this.game.moveUnitIn(this, paths[0].startDir);
    }
}

class Game {
    constructor(lines) {
        const height = this.height = lines.length;
        const width = this.width = lines[0].length;
        const cells = this.cells = new Array(width * height).fill(CELL_NOPE);
        this.marked = new Array(width * height).fill(-1);
        this.marker = -1;
        this.units = [];
        this.rounds = 0;
        this.winning = TYPE_NONE;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let i = y * width + x;
                switch (lines[y].charAt(x)) {
                    case('#'): cells[i] = CELL_WALL; break;
                    case('.'): cells[i] = CELL_NOPE; break;
                    case('E'): cells[i] = this.units.length; this.units.push(new Unit(this, TYPE_ELF, x, y)); break;
                    case('G'): cells[i] = this.units.length; this.units.push(new Unit(this, TYPE_GOBLIN, x, y)); break;
                    default: throw new Error("Unexpected character: " + lines[y].charAt(x));
                }
            }
        }
        this.countPerType = [
            this.countUnitPerType(TYPE_ELF),
            this.countUnitPerType(TYPE_GOBLIN)
        ];
    }

    countUnitPerType(type) {
        return this.units.reduce((prev, cur) => prev + (cur.type === type ? 1 : 0), 0);
    }

    nextRound() {
        for (let i = 0; i < this.units.length; i++) {
            if (this.winning != TYPE_NONE)
                return;
            this.units[i].advance();
        }
        this.rounds++;
    }

    cellAt(x, y) {
        if (typeof x === "object") {
            y = x.y;
            x = x.x;
        }
        if (x < 0 || y < 0 || x >= this.width || y >= this.height)
            return CELL_WALL;
        return this.cells[y * this.width + x];
    }

    unitAt(x, y) {
        const cell = this.cellAt(x, y);
        return cell < 0 ? null : this.units[cell].hitpoints > 0 ? this.units[cell] : null;
    }

    neighborHoodDirs(x, y, filtered) {
        let cells = [];
        if (x >= 0) cells.push(LEFT);
        if (x < this.width - 1) cells.push(RIGHT);
        if (y >= 0) cells.push(UP);
        if (y < this.height - 1) cells.push(DOWN);
        if (filtered) cells = cells.filter(d => this.cellAt(moveIn(x, y, d)) === CELL_NOPE);
        return cells;
    }

    neighborHood(x, y, filtered) {
        return this.neighborHoodDirs(x, y, filtered).map(d => moveIn(x, y, d));
    }

    findPaths(fromX, fromY, targets) {
        this.marker++;
        let paths = this.neighborHoodDirs(fromX, fromY, true)
            .map(d => ({ startDir: d, cur: moveIn(fromX, fromY, d) }));
        for (const path of paths) {
            this.marked[path.cur.y * this.width + path.cur.x] = this.marker;
        }
        const result = [];
        while(paths.length && result.length === 0) {
            let newPaths = [];
            for (let i = 0; i < paths.length; i++) {
                const path = paths[i];
                for (const to of targets) {
                    if (path.cur.x == to.x && path.cur.y === to.y)
                        result.push(path);
                }
                if (result.length > 0)
                    continue;

                const nextDirs = this.neighborHoodDirs(path.cur.x, path.cur.y, true);
                for (const nextDir of nextDirs) {
                    const newCur = moveIn(path.cur.x, path.cur.y, nextDir);
                    if (this.marked[newCur.y * this.width + newCur.x] !== this.marker) {
                        this.marked[newCur.y * this.width + newCur.x] = this.marker;
                        newPaths.push({ startDir: path.startDir, cur: newCur });
                    }
                }
            }
            paths = newPaths;
        }
        return result;
    }

    attack(attacker, victim) {
        if (victim.hitpoints <= 0)
            throw new Error("Victim is already dead");
        if (attacker.hitpoints <= 0)
            throw new Error("No zombies allowed");
        victim.hitpoints -= attacker.attack;
        if (victim.hitpoints <= 0 && --this.countPerType[victim.type] <= 0)
            this.winning = attacker.type;
    }

    moveUnitIn(unit, dir) {
        const newPos = moveIn(unit.x, unit.y, dir);
        if (this.cellAt(newPos.x, newPos.y) !== CELL_NOPE)
            throw new Error("NO GHOSTING!");
        this.cells[unit.y * this.width + unit.x] = CELL_NOPE;
        const unitIndex = this.units.findIndex(v => v === unit);
        if (unitIndex < 0)
            throw new Error("Unregistered unit detected, terminate!!!");
        this.cells[newPos.y * this.width + newPos.x] = unitIndex;
        unit.x = newPos.x;
        unit.y = newPos.y;
    }
}

function assertEq(expected, actual) {
    if (expected !== actual)
        throw new Error(`Assertion failed because ${expected} !== ${actual}`);
}
function assertArrEq(expected, actual) {
    if (!Array.isArray(expected) || !Array.isArray(actual))
        throw new Error(`Assertion failed because ${expected} or ${actual} is not an array`);
    assertEq(expected.length, actual.length);
    for (let i = 0; i < expected.length; i++)
        assertEq(expected[i], actual[i]);
}
const tests = [
    function testPathFinding() {
        const testInput = [
           //012345678
            "#######",
            "#E..G.#",
            "#...#.#",
            "#.G.#G#",
            "#######"
        ];
        const game = new Game(testInput);
        {
            const paths = game.findPaths(1, 1, [{x: 3, y: 1}]);
            assertEq(1, paths.length);
            assertEq(RIGHT, paths[0].startDir);
            assertEq(3, paths[0].cur.x);
            assertEq(1, paths[0].cur.y);
        }
        {
            const paths = game.findPaths(2, 1, [{x: 3, y: 1}]);
            assertEq(1, paths.length);
            assertEq(RIGHT, paths[0].startDir);
            assertEq(3, paths[0].cur.x);
            assertEq(1, paths[0].cur.y);
        }
        {
            const paths = game.findPaths(1, 1, [{x: 1, y: 3}]);
            assertEq(1, paths.length);
            assertEq(DOWN, paths[0].startDir);
            assertEq(1, paths[0].cur.x);
            assertEq(3, paths[0].cur.y);
        }
        {
            const paths = game.findPaths(1, 1, [{x: 2, y: 3}]);
            assertEq(0, paths.length);
        }
    }
];
for (const test of tests) test();
