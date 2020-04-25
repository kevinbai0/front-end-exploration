const path = require("path")

module.exports = {
    target: "node",
    mode: "development",
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"]
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
    },
    module: {
        rules: [
            {
                enforce: "pre",
                test: /\.m?(ts|js)$/,
                exclude: /node_modules/,
                loader: "eslint-loader"
            },
            {
                test: /\.m?(ts|js)$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"]
                    }
                }
            }
        ]
    }
}