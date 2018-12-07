const fs = require("fs");

function extractReq(line) {
    const results = /Step (\w) must be finished before step (\w) can begin\./.exec(line);
    return {
        before: results[1],
        then: results[2]
    };
}

function extractSteps(reqs) {
    const m = new Map();
    for (const req of reqs) {
        m.set(req.before, true);
        m.set(req.then, true);
    }
    return Array.from(m.keys());
}

function extractAvailableSteps(steps, reqs) {
    const av = [];
    for (const step of steps) {
        if (reqs.every(req => req.then !== step))
            av.push(step);
    }
    return av.sort();
}

function removeStep(steps, reqs, step) {
    const index = steps.indexOf(step);
    steps.splice(index, 1);
    return reqs.filter(req => req.before !== step);
}

function getOrder(input) {
    let reqs = input.map(extractReq);
    const steps = extractSteps(reqs);
    let result = "";
    while (steps.length > 0) {
        const availableSteps = extractAvailableSteps(steps, reqs);
        if (availableSteps.length === 0)
            throw new Error("Oh no cyclic dependency?");
        const step = availableSteps[0];
        result += step;
        reqs = removeStep(steps, reqs, step);
    }
    return result;
}

const testInput = [
    "Step C must be finished before step A can begin.",
    "Step C must be finished before step F can begin.",
    "Step A must be finished before step B can begin.",
    "Step A must be finished before step D can begin.",
    "Step B must be finished before step E can begin.",
    "Step D must be finished before step E can begin.",
    "Step F must be finished before step E can begin."
];

console.log("Expected:  CABDFE");
console.log("Actual:   ", getOrder(testInput));
console.log("Solution: ", getOrder(fs.readFileSync("./input", "utf8").split("\n")));
