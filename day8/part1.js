const fs = require("fs");

function buildTree(input) {
    const numbers = input.split(" ").map(s => +s);
    let index = 0;

    function readNode() {
        const childCount = numbers[index++];
        const dataCount = numbers[index++];
        const children = [];
        for (let i = 0; i < childCount; i++)
            children.push(readNode());
        const metadata = [];
        for (let i = 0; i < dataCount; i++)
            metadata.push(numbers[index++]);
        return { children, metadata };
    }
    return readNode();
}

function sumMetadata(input) {
    const root = buildTree(input);
    function sumMetadataNode(node) {
        return node.children.reduce((sum, cur) => sum + sumMetadataNode(cur), 0) +
            node.metadata.reduce((sum, cur) => sum + cur, 0);
    }
    return sumMetadataNode(root);
}

const testInput = "2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2";

console.log("Expected:  138");
console.log("Actual:   ", sumMetadata(testInput));
console.log("Solution: ", sumMetadata(fs.readFileSync("./input", "utf8")));
