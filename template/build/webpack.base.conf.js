var path = require('path')
var config = require('../config')
var utils = require('./utils')
var projectRoot = path.resolve(__dirname, '../')

var env = process.env.NODE_ENV
// check env & config/index.js to decide whether to enable CSS source maps for the
// various preprocessor loaders added to vue-loader at the end of this file
var cssSourceMapDev = (env === 'development' && config.dev.cssSourceMap)
var cssSourceMapProd = (env === 'production' && config.build.productionSourceMap)
var useCssSourceMap = cssSourceMapDev || cssSourceMapProd

var vueLoadersDev = (env === 'development' && utils.cssLoadersString({ sourceMap: useCssSourceMap }))
var vueLoadersProd = (env === 'production' && utils.cssLoaders({ sourceMap: useCssSourceMap, extract: true }))
var useVueLoaders = vueLoadersDev || vueLoadersProd

module.exports = {
  entry: {
    app: './src/main.js'
  },
  output: {
    path: config.build.assetsRoot,
    publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
    filename: '[name].js'
  },
  resolve: {
    modules: [path.join(__dirname, '../node_modules')],
    extensions: ['.js', '.vue', '.json'],
    alias: {
      {{#if_eq build "standalone"}}
      'vue$': 'vue/dist/vue.common.js',
      {{/if_eq}}
      'src': path.resolve(__dirname, '../src'),
      'assets': path.resolve(__dirname, '../src/assets'),
      'components': path.resolve(__dirname, '../src/components')
    }
  },
  module: {
    rules: [
      {{#lint}}
      {
        test: /\.vue$/,
        enforce: 'pre',
        loader: 'eslint-loader',
        include: [
          path.join(projectRoot, 'src')
        ],
        exclude: /node_modules/,
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.js$/,
        enforce: 'pre',
        loader: 'eslint-loader',
        include: [
          path.join(projectRoot, 'src')
        ],
        exclude: /node_modules/,
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {{/lint}}
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: useVueLoaders,
          postcss: [
            require('autoprefixer')({
              browsers: ['last 2 versions']
            })
          ]
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          path.join(projectRoot, 'src')
        ],
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  }
}
