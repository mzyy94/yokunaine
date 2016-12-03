const CopyWebpackPlugin = require("copy-webpack-plugin")
module.exports = {
  context: __dirname,
  entry: {
    "index": "./src/index.jsx"
  },
  output: {
    path: __dirname + "/build",
    filename: "[name].js"
  },
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        loader: "babel",
        exclude: /node_modules/,
        query: {presets: ["react"]},
      }
    ]
  },
  resolve: {
    extensions: ["", ".js", ".jsx"]
  },
  plugins: [
    new CopyWebpackPlugin([
      {from: "./options.html"},
      {from: "./options.js"},
      {from: "./manifest.json"},
    ])
  ]
};
