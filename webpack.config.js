const Path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const Package = require("./package.json");

function getOutputPath() {
    return Path.resolve(
        __dirname,
        "release",
        `${Package.name} ${Package.version}`
    );
}

module.exports = {
    entry: "./source/main.ts",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        filename: "bundle.js",
        path: getOutputPath(),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html",
        }),
        new CopyPlugin({
            patterns: [
                { from: "css", to: "css" },
                { from: "libraries", to: "libraries" },
                { from: "images", to: "images" },
            ],
        }),
    ],
};
