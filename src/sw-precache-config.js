module.exports = {
    staticFileGlobs: [
      'build/**.html',
      'build/static/css/**.css',
      'build/static/js/**.js',
      'build/static/media/**.jpg',
      'build/locales/*/**.json'
    ],
    swFilePath: './build/service-worker.js',
    stripPrefix: 'build/',
    runtimeCaching: [{
        urlPattern: /\.(?:png|jpg|jpeg|svg|json)$/,
        handler: 'NetworkFirst'
    }]
  }