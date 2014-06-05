#!/usr/bin/env node

var static = require('node-static')
    , pkjson = require('./package.json')
    , http = require('http')
    , file = new(static.Server)()
    , port = 2014
    , app = http.createServer(function (req, res) {
        if (req.url === '/version') {
            res.end(pkjson.name + ': ' + pkjson.version);
        } else {
            file.serve(req, res);
        }
    }).listen(port)
    ;

console.log("WebRTC running on port: " + port);
