const fs = require("fs");
const png = require("pngjs-image");

function extractPoints(input) {
    const PATTERN = /position=<\s*(-?\d+),\s*(-?\d+)> velocity=<\s*(-?\d+),\s*(-?\d+)>/;
    return input.map(line => {
        const results = PATTERN.exec(line);
        return {
            pos: { x: +results[1], y: +results[2] },
            vel: { x: +results[3], y: +results[4] }
        };
    });
}

function extractGrid(points) {
    let minX = Math.min.apply(null, points.map(p => p.pos.x));
    let minY = Math.min.apply(null, points.map(p => p.pos.y));
    let maxX = Math.max.apply(null, points.map(p => p.pos.x));
    let maxY = Math.max.apply(null, points.map(p => p.pos.y));
    return {
        origin: { x: minX, y: minY },
        size: { x: maxX - minX + 1, y: maxY - minY + 1 }
    };
}

function advancePoints(points) {
    for (let point of points) {
        point.pos.x += point.vel.x;
        point.pos.y += point.vel.y;
    }
}

function outputAsPNG(points, grid, path) {
    let img = png.createImage(grid.size.x, grid.size.y);
    img.fillRect(0, 0, grid.size.x, grid.size.y, { red: 0, green: 0, blue: 0, alpha: 255 });
    for (const point of points) {
        img.setAt(point.pos.x + grid.origin.x, point.pos.y + grid.origin.y, { red: 255, green: 255, blue: 255, alpha: 255 });
    }
    img.writeImage(path);
}

function outputAsPPM(points, grid, path) {
    let buffer = new Array(grid.size.x * grid.size.y).fill(0);
    for (const point of points) {
        let i = (point.pos.y-grid.origin.y) * grid.size.x + (point.pos.x-grid.origin.x);
        buffer[i] = 1;
    }
    let f = "P1 " + grid.size.x + " " + grid.size.y + " " + buffer.join(" ");
    fs.writeFileSync(path, f);
}

const points = extractPoints(fs.readFileSync(__dirname + "/input", "utf8").split("\n"));
let grid = extractGrid(points);

let seconds = 0;
while (grid.size.x != 62 || grid.size.y != 10) {
    advancePoints(points);
    grid = extractGrid(points);
    seconds++;
}

console.log(seconds);
