const LINE_CHANNEL_ACCESS_TOKEN = process.env.ACCESS_TOKEN;

var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();
var http = require('http');
var server = http.createServer(app);

app.post('/webhook', function(req, res, next) {
    res.status(200).end();
    for (var event of req.body.events) {
        if (event.type == 'message' && event.message.text == 'ハロー') {
            var headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + LINE_CHANNEL_ACCESS_TOKEN
            }
            var body = {
                replyToken: event.replyToken,
                messages: [{
                    type: 'text',
                    text: 'こんにちは'
                }]
            }
            var url = 'https://api.line.me/v2/bot/message/reply';
            request({
                url: url,
                method: 'POST',
                headers: headers,
                body: body,
                json: true
            });
        }
    }
});


var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);
server.listen(port)

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}