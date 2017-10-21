const path = require('path');
const webpack = require('webpack')
const pkg = require('../package.json');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');


const RELEASE_ROOT_PATH = 'dist';
const SOURCE_ROOT_PATH = 'src';
const RELEASE_FILE_NAME = 'page';
const RELEASE_FILE_VERSION = pkg.version;
const SOURCE_ENTRY_FILE = `${SOURCE_ROOT_PATH}/index.js`;

function resolvePath(p) {
    return path.resolve(__dirname, '../', p);
}

const banner = [
    ' * <%= pkg.name %> v<%= pkg.version %>',
    ' * (c) 2017-09-10--<%= date %> <%= pkg.author %>',
    ' * Released under the <%= pkg.license %> License.',
    ' * <%= pkg.homepage %>'
].join('\n').replace(/<%=\s([^%]+)\s%>/g, ($0, $1) => ($1 === 'date' ? ((new Date()).toLocaleDateString()) : (pkg[$1.split('.')[1]] || '')));



module.exports = [{
    entry: resolvePath(SOURCE_ENTRY_FILE),
    output: {
        filename: RELEASE_FILE_NAME + '@' + RELEASE_FILE_VERSION + '.js',
        path: resolvePath(`${RELEASE_ROOT_PATH}/debug`)
    },
    module: {
        rules: [{
            test: require.resolve('jquery'),
            use: [{
                loader: 'expose-loader',
                options: 'jQuery'
            }, {
                loader: 'expose-loader',
                options: '$'
            }]
        }, {
            test: require.resolve('vue'),
            use: [{
                loader: 'vue-loader',
                options: 'vue'
            }]
        }, {
            test: require.resolve('crypto-js'),
            use: [{
                loader: 'expose-loader',
                options: 'crypto-js'
            }]
        }, {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: "css-loader"
            })
        }, {
            test: /\.exec\.js$/,
            use: ['script-loader']
        }, {
            test: /\.(jpg|png|gif|woff|svg)$/,
            use: "url-loader?limit=8000&name=img/[name].[hash:8].[ext]"
        },
        {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['env']
                }
            }
        }
        ]
    },
    plugins: [
        new webpack.BannerPlugin(banner),
        new ExtractTextPlugin(RELEASE_FILE_NAME + '.css'),
    ],
    resolve: { alias: { 'vue': 'vue/dist/vue.min.js' } }
}, {
    entry: resolvePath(SOURCE_ENTRY_FILE),
    output: {
        filename: RELEASE_FILE_NAME + '@' + RELEASE_FILE_VERSION + '.min.js',
        path: resolvePath(`${RELEASE_ROOT_PATH}/release`)
    },
    module: {
        rules: [{
            test: require.resolve('jquery'),
            use: [{
                loader: 'expose-loader',
                options: 'jQuery'
            }, {
                loader: 'expose-loader',
                options: '$'
            }]
        }, {
            test: require.resolve('vue'),
            use: [{
                loader: 'vue-loader',
                options: 'vue'
            }]
        }, {
            test: require.resolve('crypto-js'),
            use: [{
                loader: 'expose-loader',
                options: 'crypto-js'
            }]
        }, {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: "css-loader"
            })
        }, {
            test: /\.exec\.js$/,
            use: ['script-loader']
        }, {
            test: /\.(jpg|png|gif|woff|svg)$/,
            use: "url-loader?limit=8000&name=img/[name].[hash:8].[ext]"
        },
        {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['env']
                }
            }
        }
        ]
    },
    plugins: [
        new webpack.BannerPlugin(banner),
        new ExtractTextPlugin(RELEASE_FILE_NAME + '.min.css'),
        new UglifyJSPlugin()
    ],
    resolve: { alias: { 'vue': 'vue/dist/vue.min.js' } }
}, {
    entry: resolvePath(SOURCE_ENTRY_FILE),
    output: {
        filename: RELEASE_FILE_NAME + '.min.js',
        path: resolvePath(`${RELEASE_ROOT_PATH}`)
    },
    module: {
        rules: [{
            test: require.resolve('jquery'),
            use: [{
                loader: 'expose-loader',
                options: 'jQuery'
            }, {
                loader: 'expose-loader',
                options: '$'
            }]
        }, {
            test: require.resolve('vue'),
            use: [{
                loader: 'vue-loader',
                options: 'vue'
            }]
        }, {
            test: require.resolve('crypto-js'),
            use: [{
                loader: 'expose-loader',
                options: 'crypto-js'
            }]
        }, {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: "css-loader"
            })
        }, {
            test: /\.exec\.js$/,
            use: ['script-loader']
        }, {
            test: /\.(jpg|png|gif|woff|svg)$/,
            use: "url-loader?limit=8000&name=img/[name].[hash:8].[ext]"
        },
        {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['env']
                }
            }
        }
        ]
    },
    plugins: [
        new webpack.BannerPlugin(banner),
        new ExtractTextPlugin(RELEASE_FILE_NAME + '.min.css'),
        //new UglifyJSPlugin()
    ],
    resolve: { alias: { 'vue': 'vue/dist/vue.min.js' } }
}];