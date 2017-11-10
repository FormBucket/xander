module.exports = {
  devtool: 'sourcemap',
  entry: "./app.js",
  devServer: {
    port: 3000,
    historyApiFallback: true
  },
  output: {
    path: __dirname + "/dist",
    filename: "app.js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ["babel-loader"],
      },
      {
        test: /\.css$/,
        loader: "style!css"
      }
    ]
  }
};
