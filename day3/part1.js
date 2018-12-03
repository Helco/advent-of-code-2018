
const PATTERN = /\#(\d+) \@ (\d+),(\d+): (\d+)x(\d+)/
const SIZE = 1000;

function drawClaim(map, claim) {
    var didOverlap = false;
    for (var x = claim.x; x < claim.x + claim.w; x++) {
        for (var y = claim.y; y < claim.y + claim.h; y++) {
            var cell = "x" + x + "y" + y;
            if (map[cell] == 'x')
                didOverlap = true;
            map[cell] = "x";
        }
    }
    return didOverlap;
}

function countOverlaps(list) {

}

function extractClaims(lines) {
    return lines.map(line => {
        const results = PATTERN.exec(line);
        return {
            id: results[1],
            x: results[2],
            y: results[3],
            w: results[4],
            h: results[5],
        }
    });
}

const textInput = [
    "#1 @ 1,3: 4x4",
    "#2 @ 3,1: 4x4",
    "#3 @ 5,5: 2x2"
];
