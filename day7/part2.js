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

function extractAvailableSteps(steps, reqs, workers) {
    const av = [];
    for (const step of steps) {
        if (reqs.every(req => req.then !== step) && workers.every(w => w.step !== step))
            av.push(step);
    }
    return av.sort();
}

function removeStep(steps, reqs, step) {
    const index = steps.indexOf(step);
    steps.splice(index, 1);
    return reqs.filter(req => req.before !== step);
}

function getStepDuration(step, offset) {
    const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return offset + ALPHABET.indexOf(step) + 1;
}

function getNextWorker(workers) {
    let best = 0;
    for (let i = 0; i < workers.length; i++) {
        if (workers[i].until < workers[best].until)
            best = i;
    }
    return workers[best].until < 0 ? -1 : best;
}

function getWorkOrder(input, workerCount, offset) {
    let reqs = input.map(extractReq);
    let steps = extractSteps(reqs);
    let result = "";
    let workers = [];
    for (let i = 0; i < workerCount; i++)
        workers.push({ until: -1, step: "", index: i });
    let currentTime = 0;
    while (true) {
        // Finish workers
        const finishedWorkers = workers.filter(w => w.until === currentTime).sort((a,b) => {
            return (a.step < b.step) ? -1 : (a.step > b.step) ? 1 : 0;
        });
        for (const f of finishedWorkers) {
            result += f.step;
            reqs = removeStep(steps, reqs, f.step);
        }
        if (workers.every(w => w.until <= currentTime) && steps.length === 0)
            break;

        // Assign new steps
        const availableWorkers = workers.filter(w => w.until <= currentTime);
        const availableSteps = extractAvailableSteps(steps, reqs, workers);
        for (let i = 0; i < Math.min(availableSteps.length, availableWorkers.length); i++) {
            const step = availableSteps[i];
            availableWorkers[i].until = currentTime + getStepDuration(step, offset);
            availableWorkers[i].step = step;
        }

        currentTime++;
    }
    return result + " in " + currentTime;
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

console.log("Expected:  CABFDE in 15");
console.log("Actual:   ", getWorkOrder(testInput, 2, 0));
console.log("Solution: ", getWorkOrder(fs.readFileSync("./input", "utf8").split("\n"), 5, 60));
