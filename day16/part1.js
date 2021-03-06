const fs = require("fs");

//: (regs, a, b, c) => {  }
const DIRECT_OPS = {
    addr: (regs, a, b, c) => { regs[c] = regs[a] + regs[b]; },
    addi: (regs, a, b, c) => { regs[c] = regs[a] + b; },
    mulr: (regs, a, b, c) => { regs[c] = regs[a] * regs[b]; },
    muli: (regs, a, b, c) => { regs[c] = regs[a] * b; },
    banr: (regs, a, b, c) => { regs[c] = regs[a] & regs[b]; },
    bani: (regs, a, b, c) => { regs[c] = regs[a] & b; },
    borr: (regs, a, b, c) => { regs[c] = regs[a] | regs[b]; },
    bori: (regs, a, b, c) => { regs[c] = regs[a] | b; },
    setr: (regs, a, b, c) => { regs[c] = regs[a]; },
    seti: (regs, a, b, c) => { regs[c] = a; },
    gtir: (regs, a, b, c) => { regs[c] = a > regs[b]; },
    gtri: (regs, a, b, c) => { regs[c] = regs[a] > b; },
    gtrr: (regs, a, b, c) => { regs[c] = regs[a] > regs[b]; },
    eqir: (regs, a, b, c) => { regs[c] = a == regs[b]; },
    eqri: (regs, a, b, c) => { regs[c] = regs[a] == b; },
    eqrr: (regs, a, b, c) => { regs[c] = regs[a] == regs[b]; }
};

function findPossibleOps(a, b, c, before, after)
{
    const opNames = Object.keys(DIRECT_OPS);
    for (let i = 0; i < opNames.length; i++) {
        const regs = before.slice(0);
        DIRECT_OPS[opNames[i]](regs, a, b, c);
        if (!regs.every((v, i) => v == after[i]))
            opNames.splice(i--, 1);
    }
    return opNames;
}

function extractOpTests(lines) {
    const tests = [];
    for (let i = 0; i < lines.length; i+=4) {
        const before = JSON.parse(lines[i+0].slice(8));
        const after = JSON.parse(lines[i+2].slice(8));
        const instrResults = /^(\d+) (\d+) (\d+) (\d+)/.exec(lines[i+1]);
        tests.push({
            before, after,
            op: +instrResults[1],
            a: +instrResults[2],
            b: +instrResults[3],
            c: +instrResults[4],
        });
    }
    return tests;
}

function mapOpsByTest(tests) {
    const ops = new Array(16).fill("bla").map(_ => Object.keys(DIRECT_OPS));
    for (const test of tests) {
        const possible = findPossibleOps(test.a, test.b, test.c, test.before, test.after);
        ops[test.op] = ops[test.op].filter(op => possible.indexOf(op) >= 0);
    }
    return ops;
}

function countMultiBehavingTests(tests) {
    let count = 0;
    for (const test of tests) {
        const possible = findPossibleOps(test.a, test.b, test.c, test.before, test.after);
        if (possible.length >= 3)
            count++;
    }
    return count;
}

console.log(countMultiBehavingTests(extractOpTests(fs.readFileSync(__dirname + "/optests", "utf8").split("\n"))));
