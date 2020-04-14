const path = require("path")

module.exports = {
    target: "web",
    entry: "./index.ts",
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"]
    },
    mode: "production",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "main.bundle.js",
        library: "style-x",
        libraryTarget: "umd",
        globalObject: "this"
    },
    externals : {
        react: 'react'
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