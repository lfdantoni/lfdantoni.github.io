const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const path = require('path');

module.exports = function(env, argv) {
  const devMode = process.env.NODE_ENV !== 'production' && argv.mode !== 'production';

  const plugins = [
    new HtmlWebPackPlugin({
      template: "./public/index.html",
      filename: "./index.html"
    }),
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : '[name].[hash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
    })
  ];

  if (!devMode) {
    plugins.push(new CleanWebpackPlugin()); // Clean dist folder on production mode
  }


  return {
    entry: './src/index.tsx',
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.scss'],
      alias: {
        assets: path.resolve('./src/assets'), // Makes it easier to reference our assets in jsx files
      }
    },
    devServer: {
      port: 8085,
      hot: true // hot reload with react-hot-loader
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|tsx)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "babel-loader"
            },
            {
              loader: "ts-loader"
            }
          ]
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: "html-loader"
            }
          ]
        },
        {
          test: /\.(scss|sass|css)$/,
          exclude: /node_modules/,
          use: [
            'css-hot-loader', // css hot reload
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                modules: {
                  localIdentName: '[folder]__[local]--[hash:base64:5]'
                }
              }
            },
            'sass-loader'
          ]
        },
        {
          test: /\.(png|jpe?g|gif)$/i,
          loader: 'file-loader',
          options: {
            name(file) {
              if (devMode) {
                return '[path][name].[ext]';
              }
  
              return '[name].[contenthash].[ext]';
            }
          },
        }
      ]
    },
    plugins,
    output: {
      path: __dirname + "/dist",
      filename: "[name].[hash].bundle.js"
    }
  }
}
