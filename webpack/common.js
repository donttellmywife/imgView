/* eslint-disable import/no-extraneous-dependencies */

const { resolve } = require('path');

const { NoEmitOnErrorsPlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
  context: resolve('src'),
  entry: {
    main: './index.js',
  },

  module: {
    rules: [
      // transform .js files with babel
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },

      // transform SASS to css and put inside <style> tag in head
      {
        test: /\.(css|sass|scss)$/,
        use: [
          {
            loader: 'style-loader',
          },
          'css-loader',
          'sass-loader',
        ],
      },

      // allow to load images in styles and code
      // move them into images folder with unchanged name
      // convert small images (< 8kb) into base64
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'images/[name].[ext]',
            },
          },
        ],
      },
    ],
  },

  plugins: [
    // don't build if there are any errors
    new NoEmitOnErrorsPlugin(),

    // make index.html from template
    new HtmlWebpackPlugin({
      template: 'index.html',
      minify: false,
    }),
  ],
};

module.exports = config;
