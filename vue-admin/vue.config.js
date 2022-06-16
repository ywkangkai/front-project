//此文件vue的配置文件，可以对vue进行相关配置，查看官网对具体配置

module.exports = {
  pages: {
    index: {
      //入口
      entry: 'src/main.js',
    },
  },
  lintOnSave:false, //关闭语法检查
  // devServer: { // 环境配置
  //   host: '0.0.0.0',
  //   port: 8080,
  //   https: false,
  //   hotOnly: false,
  //   disableHostCheck: true,
  //   open: false // 配置自动启动浏览器
  //
  // },






  //开启代理服务器（方式一）
  // devServer: {
  //   proxy: 'http://kangkai.com/'
  // },
  //开启代理服务器（方式二）
  // devServer: {
  //   proxy: {
  //     '/atguigu': {
  //       target: 'http://localhost:5000',
  // 			pathRewrite:{'^/atguigu':''},
  //       // ws: true, //用于支持websocket
  //       // changeOrigin: true //用于控制请求头中的host值
  //     },
  //     '/demo': {
  //       target: 'http://localhost:5001',
  // 			pathRewrite:{'^/demo':''},
  //       // ws: true, //用于支持websocket
  //       // changeOrigin: true //用于控制请求头中的host值
  //     }
  //   }
  // }
}