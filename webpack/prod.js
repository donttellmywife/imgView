/* eslint-disable import/no-extraneous-dependencies */

const { resolve } = require('path');

const CleanupPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const prod = {
  mode: 'production', // enables minification, tree-shaking

  output: {
    path: resolve('build'),
    filename: '[name].js',
  },

  module: {
    rules: [
      {
        test: /\.(css|sass|scss)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },

  devtool: 'source-map',

  plugins: [
    new CleanupPlugin(['build'], {
      // because config inside webpack dir
      root: resolve(''),
    }),

    // put css into external file
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
};

const merge = require('webpack-merge');
const common = require('./common.js');

module.exports = merge(common, prod);
