const path = require("path");
const webpack = require("webpack");

const isProduction = process.env.NODE_ENV == "production";

const commonConfig = {
  entry: {
    index: path.resolve(__dirname, "src/index.ts"),
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        loader: "ts-loader",
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
    fallback: {
      crypto: require.resolve("crypto-browserify"),
      vm: require.resolve("vm-browserify"),
      stream: require.resolve("stream-browserify"),
      path: require.resolve("path-browserify"),
      fs: false,
      child_process: false,
      util: require.resolve("util/"),
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: "process/browser",
    }),
  ],
};

const commonJSConfig = {
  ...commonConfig,
  output: {
    chunkFilename: "[name].js",
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    libraryTarget: "umd",
    globalObject: "this",
    library: {
      type: "commonjs2",
    },
  },
};

const esmConfig = {
  ...commonConfig,
  output: {
    chunkFilename: "[name].esm.js",
    filename: "[name].esm.js",
    path: path.resolve(__dirname, "dist"),
    library: {
      type: "module",
    },
  },
  experiments: {
    outputModule: true,
  },
};

module.exports = () => {
  if (isProduction) {
    commonJSConfig.mode = "production";
    esmConfig.mode = "production";
  } else {
    commonJSConfig.mode = "development";
    esmConfig.mode = "development";
  }
  return [commonJSConfig, esmConfig];
};
