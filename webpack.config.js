const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  // Set the entry point
  entry: [
    "babel-polyfill", // Babel Polyfill utility
    "./src/index.js"
  ],
  // Set the output
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "app.js"
  },
  // Devtools
  // devtool: "source-map",
  // Module configuration
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: true }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      }
    ]
  },
  // Plugins configuration
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html"
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    new UglifyJsPlugin({
      
    }),
  ]
};
