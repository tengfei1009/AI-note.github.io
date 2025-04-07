const path = require('path');

module.exports = {
  webpack: {

    // 配置别名
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },

    configure: (webpackConfig, { env, paths }) => {
      // 所有环境都会应用的配置
      webpackConfig.ignoreWarnings = [/Failed to parse source map/];
      
      // 确保 module.rules 存在
      if (!webpackConfig.module) {
        webpackConfig.module = { rules: [] };
      }
      
      // 添加自定义规则来排除 @antv/util
      // 原因: 该库的 sourcemap 无法正常解析
      // 解决: 手动排除该库的 sourcemap
      // 还有一种解决方法是,将引入的antd.css换成antd.min.css,问题解决
      webpackConfig.module.rules.push({
        enforce: 'pre',
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        loader: require.resolve('source-map-loader'),
        exclude: [
          /@babel(?:\/|\\{1,2})runtime/,
          /node_modules\/@antv\/util/,
          /node_modules\/(?!@antv\/g6)/
        ]
      });
      
      // 根据环境应用不同配置
      if (env === 'development') {
        // 仅开发环境的配置
        console.log('应用开发环境配置');
      }
      
      if (env === 'production') {
        // 仅生产环境的配置
        console.log('应用生产环境配置');
        // 例如：优化生产环境的打包大小
        webpackConfig.optimization = {
          ...webpackConfig.optimization,
          splitChunks: {
            chunks: 'all',
            name: false,
          }
        };
      }
      
      return webpackConfig;
    }
  }
};