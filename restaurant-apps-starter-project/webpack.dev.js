import { merge } from 'webpack-merge';
import path from 'path';
import common from './webpack.common.js';
import webpack from 'webpack';

export default merge(common, {
  mode: 'development',
  devtool: 'inline-source-map', // Mempermudah debugging di mode pengembangan
  output: {
    filename: '[name].bundle.js', // Gunakan nama file sederhana tanpa contenthash di mode development
    path: path.resolve('dist'),
  },
  devServer: {
    static: {
      directory: path.resolve('dist'), // Sajikan file dari direktori dist
    },
    open: true, // Buka browser secara otomatis
    compress: true, // Aktifkan kompresi gzip untuk file statis
    hot: true, // Aktifkan Hot Module Replacement (HMR)
    port: 8080, // Port default, dapat disesuaikan
    client: {
      overlay: {
        errors: true, // Tampilkan error di overlay browser
        warnings: false, // Jangan tampilkan peringatan di overlay
      },
    },
    watchFiles: {
      paths: ['src/**/*'], // Pantau perubahan hanya di folder src
      options: {
        usePolling: false, // Matikan polling untuk mengurangi overhead
      },
    },
    historyApiFallback: true, // Pastikan permintaan ke path non-eksisting diarahkan ke index.html
    proxy: {
      '/api': {
        target: 'https://restaurant-api.dicoding.dev', // Target API eksternal
        changeOrigin: true, // Ubah origin agar sesuai dengan target
        secure: false, // Tangani sertifikat self-signed
        pathRewrite: {
          '^/api': '', // Hapus prefix '/api' sebelum diteruskan ke target
        },
        onError(err, req, res) {
          console.error('Proxy error:', err); // Log error proxy
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
      'process.env.NODE_ENV': JSON.stringify('development'), // Tetapkan variabel lingkungan untuk pengembangan
    }),
  ],
});
