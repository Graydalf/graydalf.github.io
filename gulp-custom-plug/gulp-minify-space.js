// through2 是一个对 node 的 transform streams 简单封装
var through = require('through2')
var gutil = require('gulp-util')
var PluginError = gutil.PluginError

// 常量
const PLUGIN_NAME = 'gulp-prefixer'

function prefixStream(prefixText) {
  var stream = through()
  stream.write(prefixText)
  return stream
}

function filter(value) {
  return function(val) {
    return val != value
  }
}

// 插件级别函数 (处理文件)
function gulpPrefixer() {

  var jsReg = '',
    cssReg = '',
    htmlReg = />\s*([^<>]*)</g,
    extSpace = /[\f\n\r\t\v​\u00a0\u1680​\u180e\u2000​\u2001\u2002​\u2003\u2004​\u2005\u2006​\u2007\u2008​\u2009\u200a​\u2028\u2029​​\u202f\u205f​\u3000]*/g,
    htmlRegExp = /<!--[^\n]*\n/g

  return through.obj(function(chunk, enc, callback) {

    if (chunk.isNull()) {
      // 返回空文件
      callback(null, chunk)
    }

    console.log(chunk.history[0])

    if (chunk.history[0].endsWith('.html')) {
      var str = chunk.contents.toString().trim()
      str = str.replace(htmlRegExp, '')
      str = str.replace(htmlReg, '>' + '$1'.replace(extSpace, '').trim() + '<')
      chunk.contents = Buffer.from(str)
    } else if (chunk.history[0].endsWith('.html')) {

    } else if (chunk.history[0].endsWith('.html')) {

    }

    callback(null, chunk)
  })

}

// 暴露（export）插件主函数
module.exports = gulpPrefixer