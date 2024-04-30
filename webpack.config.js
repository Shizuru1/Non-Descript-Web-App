const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development", // Set the mode to 'development'
  entry: "./src/app.jsx", // Entry point of your React application
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js", // Output bundle filename
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader", // Use Babel for JSX
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"], // Use MiniCssExtractPlugin to extract CSS
      },
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "public"), // Serve HTML and assets from the 'public' directory
    },
    port: 3000,
    hot: true,
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "styles.css", // Extracted CSS file name
    }),
    new HtmlWebpackPlugin({
      template: "public/index.html", // Specify the path to your HTML template
    }),
  ],
  optimization: {
    minimizer: [new TerserPlugin()], // Use TerserPlugin for JavaScript minification
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
};
