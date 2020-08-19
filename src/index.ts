import config = require('./../config')
import cors = require("cors");
import cookieParser = require("cookie-parser");
import http = require("http")

const express = require("express");
const bodyParser = require("body-parser");
const webpack = require('webpack');
const webpackConfig = require("./../webpack.config.js");
const path = require('path');
const app = express();

// Our Express APP config
//set port
app.set("port", config.port);
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ credentials: true }));
app.options('*', cors());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

let compiler = webpack(webpackConfig);

app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true, publicPath: webpackConfig.output.publicPath, stats: { colors: true }
}));

app.use(require('webpack-hot-middleware')(compiler));
app.use(express.static(path.resolve(__dirname, 'dist')));

//start server
let server = http.createServer(app);
server.listen(app.get("port"), () => {
    console.log(
        "App is running in %d in %s mode",
        app.get("port"),
        app.get("env")
    );
})
app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'index.html')));

export default server;