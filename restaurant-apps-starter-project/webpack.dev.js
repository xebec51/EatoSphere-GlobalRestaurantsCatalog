import { merge } from 'webpack-merge';
import path from 'path';
import common from './webpack.common.js';
import webpack from 'webpack';

export default merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: {
      directory: path.resolve('dist'),
    },
    open: true,
    compress: true,
    hot: true, // Aktifkan HMR
    port: 8080, // Pastikan menggunakan port default atau sesuaikan
    client: {
      overlay: {
        errors: true, // Tampilkan error di overlay browser
        warnings: false,
      },
    },
    watchFiles: ['src/**/*'], // Batasi pantauan hanya pada folder src
    proxy: {
      '/api': {
        target: 'https://restaurant-api.dicoding.dev',
        changeOrigin: true,
        secure: false, // Tangani sertifikat self-signed
        pathRewrite: {
          '^/api': '', // Hapus prefix '/api'
        },
        onError(err, req, res) {
          console.error('Proxy error:', err);
          res.writeHead(500, {
            'Content-Type': 'text/plain',
          });
          res.end('Proxy encountered an error.');
        },
      },
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
  ],
});
