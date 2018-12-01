const fs = require("fs");

const list = fs.readFileSync("./input", "utf8")
    .split("\n")
    .map(line => parseInt(line));

const seen = new Map();
var cur = 0, iterations = 0;
while (true)
{
    for (const number of list)
    {
        iterations++;
        seen.set(cur, true);
        cur += number;

        if (seen.has(cur)) {
            console.log(`After ${iterations} I have seen ${cur} again`);
            process.exit();
        }
    }
}
