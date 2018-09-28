const path = require("path");

module.exports = {
    entry: {
        "popup": path.resolve(__dirname, "src/popup/index.js"),
        "background": path.resolve(__dirname, "src/background/index.js"),
        "content": path.resolve(__dirname, "src/content/index.js")
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "build")
    },
    target: "node"
};