const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  lintOnSave: true,
  chainWebpack: config => {
    config.resolve.alias
      .set('@$', resolve('src'))
      .set('@assets', resolve('src/assets'))
      .set('@components', resolve('src/components'))
      .set('@views', resolve('src/views'))
      .set('@const', resolve('src/const'))
      .set('static', resolve('src/static'))
    config.module.rule('')
  },
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.less$/,
          use: [
            // ...其他 loader 配置
            {
              loader: 'less-loader',
              options: {
                modifyVars: {
                  // 直接覆盖变量
                  'text-color': '#111',
                  'border-color': '#eee',
                  // 或者可以通过 less 文件覆盖（文件路径为绝对路径）
                  //'hack': `true; @import "your-less-file-path.less";`
                },
              },
            },
          ],
        },
      ],
    },
  },
}
