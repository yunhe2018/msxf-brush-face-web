let apiPrefix = ''
if (process.env.NODE_ENV === 'development') {
  // apiPrefix = 'http://10.193.198.8:8888/brush-face-admin'
  // apiPrefix = 'http://192.168.1.120:8888/brush-face-admin'
  apiPrefix = 'http://192.168.1.61:8888/brush-face-admin'
} else if (process.env.NODE_ENV === 'production') {
  apiPrefix = '/brush-face-admin'
}

const version = 'SLT-1-V1.3.0'

module.exports = {
  apiPrefix,
  version
}
