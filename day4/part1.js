const fs = require("fs");

const BEGIN = 0;
const SLEEP = 1;
const WAKE = 2;

function extractEvents(testInput) {
    const events = testInput.map(line => {
        const parts = /\[\d+-(\d+)-(\d+) (\d+)\:(\d+)\] (.+)/.exec(line);
        let guardId = -1;
        let type;
        if (parts[5].indexOf("begins shift") >= 0) {
            type = BEGIN;
            guardId = +(/\#(\d+)/.exec(parts[5])[1])
        }
        else if (parts[5].indexOf("falls asleep") >= 0)
            type = SLEEP;
        else if (parts[5].indexOf("wakes up") >= 0)
            type = WAKE;
        else
            throw new Error("Oh no wrong type");
        return {
            ts:
                (+parts[1]) * 1000000 +
                (+parts[2]) *   10000 +
                (+parts[3]) *     100 +
                (+parts[4]) *       1,
            min: +parts[4],
            type: type,
            guard: guardId
        };
    });
    const sorted = events.sort((a, b) =>
        a.ts - b.ts
    );

    let lastGuardId = -1;
    return sorted.map((ev) => {
        if (ev.type === BEGIN)
            lastGuardId = ev.guard;
        else if (lastGuardId < 0)
            throw new Error("Oh no not sorted");
        else
            ev.guard = lastGuardId;
        return ev;
    });
}

function countSleeping(events) {
    const sleepingGuards = new Map();
    for (var i = 0; i < events.length; i++) {
        if (events[i].type == WAKE) {
            if (events[i-1].type !== SLEEP)
                throw new Error("oh no no sleeps");
            if (events[i-1].guard !== events[i].guard)
                throw new Error("oh no not same guard");
            const curSleeps = events[i].min - events[i-1].min;
            let totalSleeps = sleepingGuards.get(events[i].guard) || 0;
            totalSleeps += curSleeps;
            sleepingGuards.set(events[i].guard, totalSleeps);
        }
    }
    let maxGuard = -1;
    for (const pair of sleepingGuards) {
        if (maxGuard < 0) {
            maxGuard = pair[0];
            continue;
        }
        if (pair[1] > sleepingGuards.get(maxGuard))
            maxGuard = pair[0];
    }
    return maxGuard;
}

function findBestMinute(events, guard) {
    const minutes = new Array(60).fill(0);
    events.forEach((ev, i) => {
        if (ev.guard !== guard || ev.type !== WAKE)
            return;
        if (events[i-1].type !== SLEEP)
            throw new Error("oh no no sleeps");
        if (events[i-1].guard !== events[i].guard)
            throw new Error("oh no not same guard");
        const curSleeps = events[i].min - events[i-1].min;
        for (var j = 0; j < curSleeps; j++)
            minutes[events[i-1].min + j]++;
    });

    let bestMinute = 0;
    for (var i = 0; i < 60; i++) {
        if (minutes[i] > minutes[bestMinute])
            bestMinute = i;
    }
    return bestMinute;
}

function findBestGuard(testInput, prefix) {
    const events = extractEvents(testInput);
    const bestGuard = countSleeping(events);
    const bestMinute = findBestMinute(events, bestGuard);
    const result = bestGuard * bestMinute;
    console.log(`${bestGuard} * ${bestMinute} = ${result}`);
    return;
}

const testInput = [
    "[1518-11-01 00:00] Guard #10 begins shift",
    "[1518-11-01 00:05] falls asleep",
    "[1518-11-01 00:25] wakes up",
    "[1518-11-01 00:30] falls asleep",
    "[1518-11-01 00:55] wakes up",
    "[1518-11-01 23:58] Guard #99 begins shift",
    "[1518-11-02 00:40] falls asleep",
    "[1518-11-02 00:50] wakes up",
    "[1518-11-03 00:05] Guard #10 begins shift",
    "[1518-11-03 00:24] falls asleep",
    "[1518-11-03 00:29] wakes up",
    "[1518-11-04 00:02] Guard #99 begins shift",
    "[1518-11-04 00:36] falls asleep",
    "[1518-11-04 00:46] wakes up",
    "[1518-11-05 00:03] Guard #99 begins shift",
    "[1518-11-05 00:45] falls asleep",
    "[1518-11-05 00:55] wakes up"
];
findBestGuard(testInput, "Actual:  ");
console.log("Expected: 10 * 24 = 240");
findBestGuard(fs.readFileSync("./input", "utf8").split("\n"), "Solution: ");
