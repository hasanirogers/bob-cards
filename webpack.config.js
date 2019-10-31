const path = require('path');
const merge = require('webpack-merge');
const workbox = require('workbox-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { createCompatibilityConfig } = require('@open-wc/building-webpack');


const configs = createCompatibilityConfig({
  input: path.resolve(__dirname, './index.html'),
});

module.exports = [
  // add plugin to the first config
  merge(configs[0], {
    plugins: [
      new CopyWebpackPlugin(
        ['manifest.json', 'images/**/*.*']
      ),

      new workbox.GenerateSW({
        swDest: 'sw.js',
        skipWaiting: true,
        clientsClaim: true,
        runtimeCaching: [
          {
            urlPattern: new RegExp('^https://api\.bobcards\.app/'),
            handler: 'StaleWhileRevalidate',
            options: {
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: new RegExp('^https://nominatim\.openstreetmap\.org/'),
            handler: 'StaleWhileRevalidate',
            options: {
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: new RegExp('^https://fonts.(?:googleapis|gstatic).com/(.*)'),
            handler: 'cacheFirst'
          },
          {
              urlPattern: /.*/,
              handler: 'networkFirst'
          },
        ]
      })
    ],
  }),

  // the second config left untouched
  configs[1],
];
