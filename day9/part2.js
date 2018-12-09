
function getHighscore(playerCount, lastMarble) {
    const players = new Array(playerCount).fill(0);
    let circle = [ 0 ];
    let currentMarbleI = 0;
    let currentPlayer = 0;
    for (let curMarble = 1; curMarble <= lastMarble; curMarble++) {
        if (curMarble % 23 > 0) {
            currentMarbleI = (currentMarbleI + 2);
            if (currentMarbleI > circle.length)
                currentMarbleI -= circle.length;
            circle = circle.slice(0, currentMarbleI).concat(curMarble).concat(circle.slice(currentMarbleI));
        }
        else {
            currentMarbleI -= 7;
            if (currentMarbleI < 0)
                currentMarbleI += circle.length;
            players[currentPlayer] += curMarble + circle.splice(currentMarbleI, 1)[0];
        }
        currentPlayer = (currentPlayer + 1) % players.length;
    }

    let best = 0;
    for (let i = 0; i < players.length; i++) {
        if (players[i] > players[best])
            best = i;
    }
    return players[best];
}

const testInput = [
    { players: 10, lastMarble: 1618, expected: 8317 },
    { players: 13, lastMarble: 7999, expected: 146373 },
    { players: 17, lastMarble: 1104, expected: 2764 },
    { players: 21, lastMarble: 6111, expected: 54718 },
    { players: 30, lastMarble: 5807, expected: 37305 }
];
const realInput = { players: 423, lastMarble: 7194400 };

for (const test of testInput) {
    const actual = getHighscore(test.players, test.lastMarble);
    console.log(`Expected: ${test.expected}\tActual: ${actual}\t${actual===test.expected ? "SUCCESS" : "FAILED"}`);
}
console.log("Solution: ", getHighscore(realInput.players, realInput.lastMarble));
