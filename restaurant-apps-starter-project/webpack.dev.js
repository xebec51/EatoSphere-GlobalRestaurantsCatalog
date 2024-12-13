const { merge } = require('webpack-merge');
const path = require('path');
const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    open: true,
    compress: true,
    hot: true,
    // Remove the port configuration to use the default port
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    watchFiles: ['src/**/*'],
    proxy: {
      '/api': {
        target: 'https://restaurant-api.dicoding.dev',
        changeOrigin: true,
        secure: false, // Add this line to handle self-signed certificates
        pathRewrite: {
          '^/api': '',
        },
        onError(err, req, res) {
          res.writeHead(500, {
            'Content-Type': 'text/plain',
          });
          res.end('Something went wrong. And we are reporting a custom error message.');
        },
      },
    },
  },
});
