const ENV = process.env.APP_ENV || 'development'
const fs = require('node-fs-extra')

fs.copySync('./src/firebase/firebase-config.' + ENV + '.js', './src/firebase/config.js')
