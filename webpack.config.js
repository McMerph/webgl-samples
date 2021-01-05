/* eslint-env node */

/* eslint-disable @typescript-eslint/no-var-requires */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const fs = require('fs');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
/* eslint-enable */

const findPageDirs = (initialPath, filter) => {
  const result = [];
  const fn = (startPath) => {
    const files = fs.readdirSync(startPath);
    files.forEach((file) => {
      const filename = path.join(startPath, file);
      if (fs.lstatSync(filename).isDirectory()) {
        fn(filename);
      } else if (filename.includes(filter)) {
        result.push(path.dirname(filename).split(path.sep));
      }
    });
  };
  fn(initialPath);

  return result;
};

const entries = findPageDirs('./src/pages', 'index.html').map(
  (pathSegments) => {
    const normalizedDir = pathSegments.join('_');
    const lastDir = path.resolve(__dirname, ...pathSegments);

    return {
      entry: path.resolve(lastDir, 'index.ts'),
      template: path.resolve(lastDir, 'index.html'),
      htmlFilename: `${normalizedDir}_index.html`,
      chunkName: `${normalizedDir}`,
    };
  }
);

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
        test: /\.glsl$/i,
        use: ['raw-loader'],
      },
      {
        test: require.resolve('./lib/matrix4/index.js'),
        loader: 'exports-loader',
        options: {
          exports: ['Matrix4'],
        },
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
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
      templateContent: `<!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>WebGL samples</title>
          <meta name="viewport" content="width=device-width,initial-scale=1" />
        </head>
        <body>
          <ul>${entries
            .map(
              (v) => `<li><a href="${v.htmlFilename}">${v.htmlFilename}</li>`
            )
            .join('')}
          </ul>
        </body>
      </html>
      `,
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
