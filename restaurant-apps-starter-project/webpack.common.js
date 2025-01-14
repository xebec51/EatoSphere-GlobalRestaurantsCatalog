import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import WorkboxWebpackPlugin from 'workbox-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

export default {
  entry: {
    app: path.resolve('src/scripts/index.js'),
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve('dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif|webp)$/i, // Tambahkan 'webp'
        type: 'asset/resource',
        generator: {
          filename: 'images/[name][ext]', // Simpan gambar di folder dist/images
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve('src/templates/index.html'),
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve('src/public/'),
          to: path.resolve('dist/'),
        },
      ],
    }),
    new WorkboxWebpackPlugin.GenerateSW({
      swDest: 'sw.bundle.js', // Ensure the service worker file is named sw.bundle.js
      clientsClaim: true,
      skipWaiting: true,
      runtimeCaching: [
        {
          urlPattern: ({ url }) => url.origin === 'https://restaurant-api.dicoding.dev',
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'restaurant-api',
          }
        }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
};
