/*
  webpack sees every file as a module.
  How to handle those files is up to loaders.
  We only have a single entry point (a .js file) and everything is required from that js file
*/

const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const autoprefixer = require("autoprefixer");
const devMode = process.env.NODE_ENV !== "production";

// This is our JavaScript rule that specifies what to do with .js files
const javascript = {
  test: /\.(js)$/, // see how we match anything that ends in `.js`? Cool
  use: [
    {
      loader: "babel-loader",
      options: { presets: ["env"] } // this is one way of passing options
    }
  ]
};

// this is our sass/css loader. It handles files that are require('something.scss')
const styles = {
  test: /\.(sa|sc|c)ss$/,
  use: [
    MiniCssExtractPlugin.loader,
    "css-loader",
    "sass-loader",
    {
      loader: "postcss-loader",
      options: {
        sourceMap: true,
        plugins() {
          return [autoprefixer({ browsers: "last 3 versions" })];
        }
      }
    }
  ]
};

// OK - now it's time to put it all together
const config = {
  entry: {
    // we only have 1 entry, but I've set it up for multiple in the future
    app: "./public/javascripts/index.js"
  },
  // Once things are done, we kick it out to a file.
  output: {
    // path is a built in node module
    // __dirname is a variable from node that gives us the
    path: path.resolve(__dirname, "public", "dist"),
    // we can use "substitutions" in file names like [name] and [hash]
    // name will be `App` because that is what we used above in our entry
    filename: "[name].bundle.js"
  },
  // remember we said webpack sees everything as modules and how different loaders are responsible for different file types? Here is is where we implement them. Pass it the rules for our JS and our styles
  module: {
    rules: [javascript, styles]
  },
  plugins: [
    new CleanWebpackPlugin(["public/dist"]),
    // here is where we tell it to output our css to a separate file
    new MiniCssExtractPlugin({
      filename: devMode ? "style.css" : "style.[hash].css",
      chunkFilename: devMode ? "[id].css" : "[id].[hash].css"
    })
  ]
};

// webpack is cranky about some packages using a soon to be deprecated API. shhhhhhh
//process.noDeprecation = true;

module.exports = config;
