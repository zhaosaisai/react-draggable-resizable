const path = require('path')
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'lib'),
        libraryTarget: 'commonjs2'
    },
    externals: /^(react|babel-runtime)/,
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: ['babel-loader'],
                exclude: path.resolve(__dirname, 'node_modules')
            },
            {
                test: /\.css$/,
                use: ExtractTextWebpackPlugin.extract({
                    use: ['css-loader']
                })
            }
        ]
    },
    plugins: [
        new ExtractTextWebpackPlugin({
            filename: 'style.css'
        })
    ],
    devtool: 'source-map',
    resolve: {
        extensions: ['.js', '.jsx']
    }
}