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
                test: /\.m?(ts|js|tsx)$/,
                exclude: /(node_modules|bower_components|examples)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        "presets": [
                          "@babel/preset-typescript",
                          "@babel/preset-env",
                          "@babel/preset-react"
                        ],
                        "plugins": [
                          "@babel/proposal-class-properties",
                          "@babel/proposal-object-rest-spread",
                          "@babel/plugin-proposal-numeric-separator"
                        ]
                    }
                    
                }
            }
        ]
    },
}
