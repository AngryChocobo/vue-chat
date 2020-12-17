module.exports = {
  pages: {
    index: {
      // page 的入口
      entry: 'src/main.ts',
      // 模板来源
      template: 'public/index.html',
      // 在 dist/index.html 的输出
      filename: 'index.html',
      // 当使用 title 选项时，
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: '聊聊',
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      chunks: ['chunk-vendors', 'chunk-common', 'index'],
    },
  },
  lintOnSave: true,
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
