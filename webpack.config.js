/* eslint-env node */

/* eslint-disable @typescript-eslint/no-var-requires */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
/* eslint-enable */

const getEntriesGroup = (groupName, pages) =>
  pages.map((v) => ({
    entry: path.resolve(__dirname, 'src', groupName, v, 'index.ts'),
    template: path.resolve(__dirname, 'src', groupName, v, 'index.html'),
    htmlFilename: `${groupName}/${v}.html`,
    chunkName: `${groupName}-${v}`,
  }));
const entries = getEntriesGroup('chapter-2', [
  'draw-rectangle',
  'hello-canvas',
  'hello-point1',
]);

module.exports = {
  devServer: {
    open: true,
  },
  entry: entries.reduce(
    (acc, item) => ({ ...acc, [item.chunkName]: item.entry }),
    {}
  ),
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(vert|frag)$/i,
        use: ['raw-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: '[chunkhash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, 'src', 'index.html'),
      chunks: [],
    }),
    ...entries.map(
      (v) =>
        new HtmlWebpackPlugin({
          filename: v.htmlFilename,
          template: v.template,
          chunks: [v.chunkName],
        })
    ),
    new MiniCssExtractPlugin(),
    new CleanWebpackPlugin(),
  ],
};
