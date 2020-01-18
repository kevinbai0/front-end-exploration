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
        library: "DesignSystem",
        libraryTarget: "umd",
        globalObject: "this"
    },
    module: {
        rules: [
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