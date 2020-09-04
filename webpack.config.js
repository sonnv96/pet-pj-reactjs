const path = require('path');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const hwp = require('html-webpack-plugin');

module.exports = function (env) {
    const my_env = (typeof env == 'object' && ["development", "production"].includes(env.NODE_ENV)) ? env.NODE_ENV : 'none';
    console.log('env.NODE_ENV: ' + my_env);

    return {
        mode: my_env,
        devtool: my_env == 'production' ? 'none' : 'eval-source-map',
        entry: './src/index.js',
        output: {
            // Add content hash ([contenthash]) to avoid caching script
            filename: 'bundle.min.js',
            path: path.join(__dirname, 'dist'),
            chunkFilename: 'bundle.vendor.js',
        },
        module: {
            rules: [{
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
                resolve: {
                    extensions: [".js", ".jsx"]
                }
            }, {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "eslint-loader",
                    options: {
                        failOnError: true,
                        quiet: true,
                    },
                },
            },
            {
                // test: /\.s[ac]ss$/i,
                // just config for less loader
                test: /\.less$/,
                exclude: /node_modules/,
                use: [
                    // Creates `style` nodes from JS strings
                    'style-loader',
                    // Translates CSS into CommonJS
                    'css-loader',
                    // Compiles less to CSS
                    'less-loader',
                ],
            },
            ]
        },
        devServer: {
            port: '3001'
        },
        optimization: {
            minimizer: [
                new UglifyJSPlugin({
                    sourceMap: true,
                    chunkFilter: (chunk) => {
                        // Exclude uglification for the `vendor` chunk
                        /* enable this block when updated naming for chunk file to exclude "vendor"
                        if (chunk.name.indexOf('.vendor.') > 0) {
                          return false;
                        }
                        */

                        return true;
                    },
                    uglifyOptions: {
                        keep_fnames: false,
                        compress: {
                            dead_code: false,
                            unused: true
                        },
                        output: {
                            comments: false
                        }
                    }
                })
            ],
            // TODO: do not split chunks now, because same source code for both collection and search
            // splitChunks: {
            //   cacheGroups: {
            //     reactVendor: {
            //       chunks: 'initial',
            //       test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            //       name: "react"
            //     }
            //   },
            // },
        },
        plugins: [
            new FriendlyErrorsWebpackPlugin(),
            new webpack.NormalModuleReplacementPlugin(
                /* regex to filter the module */
                /_environments\/environment/gi,
                /* callback function */
                resource =>
                    /* we change for env mode here */
                    !env || !env.NODE_ENV || env.NODE_ENV === 'development' ?
                        resource /* no change */ :
                        resource.request += '.' + env.NODE_ENV
            ),
            new hwp({ template: path.join(__dirname, '/public/index.html') })
        ],
    }
};
