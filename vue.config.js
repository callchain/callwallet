const path = require('path')

module.exports = {
  publicPath: './',
  outputDir: 'dist',
  lintOnSave: false,
  transpileDependencies: [
    'vuetify'
  ],
  configureWebpack: {
    resolve: {
      alias: {
        '@callchain/call-core-lib': path.resolve(__dirname, '../call-core-lib/dist/browser/call-core-lib.min.js')
      },
      fallback: {
        'events': require.resolve('events/'),
        'stream': false,
        'util': false,
        'buffer': false,
        'crypto': false
      }
    },
    module: {
      rules: [
        {
          test: /call-core-lib\.min\.js$/,
          use: ['script-loader']
        }
      ]
    }
  }
}
