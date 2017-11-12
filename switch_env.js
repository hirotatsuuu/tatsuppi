const ENV = process.env.APP_ENV || 'development'
const fse = require('node-fs-extra')

fse.copySync('./src/firebase/firebase-config.' + ENV + '.js', './src/firebase/config.js')

fse.copySync('./.firebase-' + ENV + '.firebaserc', './.firebaserc')
