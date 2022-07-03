const path = require('path')
const nodeExternals = require('webpack-node-externals')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  entry: './lib/workers/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      lib: path.resolve('lib'),
    },
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist/lib/workers'),
  },
  externalsPresets: { node: true },
  externals: [nodeExternals()],
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
}
