const path = require("path")

module.exports = {
    target: "web",
    entry: "./index.rn.ts",
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"]
    },
    mode: "production",
    output: {
        path: path.resolve(__dirname, "native/dist"),
        filename: "./main.bundle.js",
        library: "style-x",
        libraryTarget: "umd",
        globalObject: "this"
    },
    externals: {
        'react-native': 'react-native'
    },
    module: {
        rules: [
            {
                test: /\.m?(ts|js)$/,
                exclude: /(node_modules|bower_components|examples)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env", "module:metro-react-native-babel-preset"]
                    }
                }
            }
        ]
    },
}