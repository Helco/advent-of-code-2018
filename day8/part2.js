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

function sumReferencedMetadata(input) {
    const root = buildTree(input);
    function sumMetadataNode(node) {
        if (node.children.length === 0)
            return node.metadata.reduce((sum, cur) => sum + cur, 0);
        else
            return node.metadata.reduce((sum, cur) => {
                if (cur >= 1 && cur <= node.children.length)
                    return sum + sumMetadataNode(node.children[cur - 1]);
                else
                    return sum;
            }, 0);
    }
    return sumMetadataNode(root);
}

const testInput = "2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2";

console.log("Expected:  66");
console.log("Actual:   ", sumReferencedMetadata(testInput));
console.log("Solution: ", sumReferencedMetadata(fs.readFileSync("./input", "utf8")));
