let apiPrefix = ''
if (process.env.NODE_ENV === 'development') {
  apiPrefix = 'http://10.16.30.9:8887'
  // apiPrefix = 'http://192.168.1.60:8887'
}
// else if (process.env.NODE_ENV === 'production') {
//   let hostStr = location.protocol + '//' + location.hostname
//   apiPrefix = hostStr + ':8887'
// }

module.exports = {
  apiPrefix
}
