const fs = require("fs");

console.log(
    fs.readFileSync("./input", "utf8")
    .split("\n")
    .map(line => parseInt(line))
    .reduce((prev, cur) => prev + cur, 0)
);
