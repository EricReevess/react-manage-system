const { override, fixBabelImports, addLessLoader, addWebpackAlias } = require('customize-cra')
const path = require('path')
const theme = require('./custom-antd-theme')

function resolve (dir) {
  return path.join(__dirname, '.', dir)
}

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true
  }),
  addLessLoader({
    lessOptions:{ // 新版需要使用lessOptions进行包裹
      javascriptEnabled: true,
      modifyVars: theme
    }
  }),

  addWebpackAlias({
    '@': resolve('src')
  }),

)
