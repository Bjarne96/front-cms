path = require('path')
webpack = require('webpack')
HtmlWebpackPlugin = require('html-webpack-plugin')
CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
    entry: {
        app: ['./src/app.tsx', 'webpack-hot-middleware/client'],
        vendor: ['react', 'react-dom']
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'public/[name].bundle.js'
    },
    mode: 'development',
    devtool: 'source-map',
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx']
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                loader: 'ts-loader'
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
        ]            
    },
    plugins: [
        new HtmlWebpackPlugin({ template: path.resolve(__dirname, 'src', 'index.html') }),
        new webpack.HotModuleReplacementPlugin(),
        new CopyWebpackPlugin([
            {from: path.resolve(__dirname, 'src/public'), to:  path.resolve(__dirname, 'dist/public')} 
        ]), 
    ]
}