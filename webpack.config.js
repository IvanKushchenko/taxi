const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const autoprefixer = require('autoprefixer');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

const config = {
  entry: ['@babel/polyfill', './src/index.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'script.[contenthash].js',
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  useBuiltIns: 'usage',
                  targets: 'last 5 versions',
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    'autoprefixer',
                    {
                      overrideBrowserslist: ['ie >= 8', 'last 4 version'],
                    },
                  ],
                ],
              },
              sourceMap: true,
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts',
            },
          },
        ],
      },
      {
        test: /\.(jpg|png|svg)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'images',
          },
        },
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: path.resolve(__dirname, 'src/images'), to: path.resolve(__dirname, 'dist/images') },
        { from: path.resolve(__dirname, 'src/fonts'), to: path.resolve(__dirname, 'dist/fonts') },
      ],
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
      filename: 'index.html',
      inject: 'body',
    }),
    new MiniCssExtractPlugin({
      filename: 'style.[contenthash].css',
    }),
    new CleanWebpackPlugin(),
    new ImageMinimizerPlugin({
      minimizerOptions: {
        plugins: [
          ['jpegtran', { progressive: true }],
          ['optipng', { optimizationLevel: 5 }],
        ],
      },
    }),
  ],
  devServer: {
    contentBase: path.join(__dirname, 'src'),
    compress: true,
    port: 3300,
    host: '0.0.0.0',
    open: true,
  },
};

module.exports = config;
