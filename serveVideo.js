#!/usr/bin/env node

var static = require('node-static')
    , http = require('http')
    , file = new(static.Server)()
    , port = 2014
    , app = http.createServer(function (req, res) {
        file.serve(req, res);
    }).listen(port)
    ;

console.log("WebRTC running on port: " + port);
