const fs = require("fs");

function extractState(input) {
    return {
        origin: 0,
        cells: new Array(input.length).fill(false).map((_,i) => input.charAt(i) === '#')
    };
}

function extractRules(input) {
    return input.map(line => {
        const [state, result] = line.split(" => ");
        return {
            cells: extractState(state).cells,
            result: result === '#'
        };
    });
}

function nextGeneration(prevState, rules) {
    const nextState = {
        origin: prevState.origin,
        cells: [ ]
    };
    const ruleLength = rules[0].cells.length>>1;
    var didFoundSometimes = false;
    var foundResult;
    for (var i = -ruleLength; i < prevState.cells.length + ruleLength; i++) {
        var foundRule = false;
        for (const rule of rules) {
            var j;
            for (j = -ruleLength; j <= +ruleLength; j++) {
                var prevCell = (i+j) >= 0 && (i+j) < prevState.cells.length ? prevState.cells[i+j] : false;
                if (prevCell !== rule.cells[j + ruleLength])
                    break;
            }
            if (j > ruleLength) {
                foundResult = rule.result;
                foundRule = true;
                break;
            }
        }
        if (foundRule) {
            nextState.cells.push(foundResult);
            didFoundSometimes = true;
            if (i < 0)
                nextState.origin = Math.min(nextState.origin, prevState.origin + i);
        }
        else if (i >= 0 || didFoundSometimes)
            nextState.cells.push(false);
    }
    return nextState;
}

function skipGenerations(prevState, rules, genCount) {
    for (let i = 0; i < genCount; i++)
        prevState = nextGeneration(prevState, rules),
        console.log(addPotNumbers(prevState));
    return prevState;
}

function addPotNumbers(state) {
    let result = 0;
    for (let i = 0; i < state.cells.length; i++) {
        if (state.cells[i])
            result += state.origin + i;
    }
    return result;
}

const testState = extractState("#..#.#..##......###...###");
const testRules = extractRules([
    "...## => #",
    "..#.. => #",
    ".#... => #",
    ".#.#. => #",
    ".#.## => #",
    ".##.. => #",
    ".#### => #",
    "#.#.# => #",
    "#.### => #",
    "##.#. => #",
    "##.## => #",
    "###.. => #",
    "###.# => #",
    "####. => #"
]);
let myState = extractState(fs.readFileSync(__dirname + "/state", "utf8"));
const myRules = extractRules(fs.readFileSync(__dirname + "/rules", "utf8").split("\n"));

console.log("Expected: 325");
//console.log("Actual:  ", addPotNumbers(skipGenerations(testState, testRules, 20)));

let last = -1;
let cur = addPotNumbers(myState);
let lastDelta = -1;
while (cur != last && lastDelta !== 0) {
    last = cur;
    myState = nextGeneration(myState, myRules);
    cur = addPotNumbers(myState);
}
