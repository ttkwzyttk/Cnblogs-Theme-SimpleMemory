const webpack = require('webpack');
const path = require('path');
const json5 = require('json5');
const terserPlugin = require("terser-webpack-plugin");
const fileManagerPlugin = require('filemanager-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");
const miniCssExtractPlugin = require("mini-css-extract-plugin");
const cssMinimizerPlugin = require('css-minimizer-webpack-plugin');

/**
 * 随机字符串
 * @param len
 * @returns {string}
 */
function randomString(len) {
    len = len || 32;
    let $chars = 'abcdefhijkmnprstwxyz23456789';
    let maxPos = $chars.length;
    let pwd = '';
    for (let i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}

/**
 * 模块导出配置代码
 */

module.exports = {
    // 配置编译环境，与输出文件相关内容
    mode: 'production',
    entry: './src/main.js',
    output: {
        filename: 'simpleMemory.js',
        chunkFilename:'script/[name].[contenthash:8].js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        charset: true
    },
    //配置使用到的插件
    plugins: [
        // 文件管理插件，复制simpleMemory.js并添加随机字符串防止缓存
        new fileManagerPlugin({
            events: {
                onEnd: {
                    copy: [
                        { source: './dist/simpleMemory.js', destination: './dist/simpleMemory.' + randomString(8) + '.js' },
                    ],
                }
            }
        }),
        // CSS提取插件，将CSS单独打包成文件
        new miniCssExtractPlugin({
            filename: 'style/[name].[contenthash:8].css',
            chunkFilename:'style/[name].[contenthash:8].css',
            ignoreOrder: true
        }),
    ],
    // devtool: 'inline-source-map',
    optimization: {
        // 使用minimizer列表中的插件去压缩js/css
        minimize: true,
        innerGraph: false,
        mangleWasmImports: true,
        // 拆分chunk配置
        splitChunks: {
            chunks: 'async',
            minSize: 20000,
            minRemainingSize: 0,
            minChunks: 1,
            maxAsyncRequests: 30,
            maxInitialRequests: 30,
            enforceSizeThreshold: 50000
        },
        // 压缩插件
        minimizer: [
            new terserPlugin({
                  parallel: true,
                  extractComments: false,
            }),
            new cssMinimizerPlugin({
                minimizerOptions: {
                    preset: ["default", {
                        discardComments: { removeAll: true },
                    },
                    ],
                },
                parallel: true,
            }),
            new CompressionPlugin({
                algorithm: 'gzip',
                test: /\.js$|\.html$|\.css$/,
                minRatio: 1,
                threshold: 10240,
                deleteOriginalAssets: false,
            })
        ],
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    {
                        loader: miniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../'
                        }
                    },
                    'css-loader'
                ],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[hash][ext][query]'
                }
            },
            {
                test: /\.json5$/i,
                type: 'json',
                parser: {
                    parse: json5.parse,
                },
            },
            {
                test: /\.html$/i,
                loader: 'html-loader',
                options: {
                    minimize: true,
                },
            },
            {
                test: /\.(woff|woff2|eot|ttf)?$/,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[hash][ext][query]'
                }
            }
        ],
    },
};