module.exports = {
  context: __dirname,
  entry: {
    jsx: "./src/index.jsx"
  },
  output: {
    path: __dirname + "/build",
    filename: "index.js"
  },
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        loader: "babel",
        exclude: /node_modules/,
        query: {presets: ["es2015", "stage-1", "react"]}
      }
    ]
  },
  resolve: {
    extensions: ["", ".js", ".jsx"]
  }
};
