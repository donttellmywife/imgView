/* eslint-disable import/no-extraneous-dependencies */

const dev = {
  mode: 'development',

  devtool: 'eval-source-map',
  devServer: {
    port: 8080,
    inline: true,
  },
};

const merge = require('webpack-merge');
const common = require('./common.js');

module.exports = merge(common, dev);
