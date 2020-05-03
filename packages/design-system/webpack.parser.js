const path = require("path")

module.exports = {
    target: "node",
    entry: "./src/interpreter/parser.ts",
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"]
    },
    mode: "production",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "parser.bundle.js",
    },
    module: {
        rules: [
            {
                test: /\.m?(ts|js)$/,
                exclude: /(node_modules|bower_components|examples)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"]
                    }
                }
            }
        ]
    },
}