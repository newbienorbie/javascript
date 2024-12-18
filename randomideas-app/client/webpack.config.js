const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "../public"),
    filename: "bundle.js",
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, "../public"),
    },
    port: 3000,
    open: true,
    hot: true,
    compress: true,
    historyApiFallback: true,
    proxy: {
      "/api": "http://localhost:5000",
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
        // where do i want style-loader and css-loader loader to  apply? in this case it's all files that ends with .css
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Webpack App", // google HtmlWebpackPlugin to check the options
      filename: "index.html",
      template: "./src/index.html",
    }),
    new MiniCssExtractPlugin(),
  ],
};
