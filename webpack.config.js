const path = require("path");

module.exports = {
  // Entry point of your application
  entry: "./src/contentScript.js",

  // Output configuration
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },

  // Module resolution and transformation rules
  module: {
    rules: [
      {
        // Transform JavaScript files
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            // Babel preset to transpile modern JavaScript
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },

  // Source map for debugging
  devtool: "source-map",

  // Optimisation options
  optimization: {
    minimize: true,
  },
};
