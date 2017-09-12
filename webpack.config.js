const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  context: __dirname + '/src',
  entry: {
    bundle: './index.jsx',
  },
  output: {
    path: __dirname + '/public',
    filename: '[name].js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query:{
          presets: ['react', 'es2015', 'stage-2']
        }
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.(jpg|png)$/,
        use: [
          {
            loader: 'file-loader?name=images/[name].[ext]',
            options: {
              limit: 8192,
              mimetype: 'image/png'
            }
          }
        ]
      },
    ]
  },
  plugins: [
    new ExtractTextPlugin('index.css'),
    new HtmlWebpackPlugin({
      template: __dirname + '/src/index.html',
    }),
  ],
  devtool: 'inline-source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.css', '.html']
  },
  devServer: {
    contentBase: 'public',
    port: 1192,
    inline: true,
    hot: true
  },
};
