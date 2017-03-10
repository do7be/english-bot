const LINE_CHANNEL_ACCESS_TOKEN = process.env.ACCESS_TOKEN;

var fs = require('fs');
var parse = require('csv-parse');
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();
var http = require('http');
var server = http.createServer(app);
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.post('/webhook', function(req, res, next) {
    res.status(200).end();
    for (var event of req.body.events) {
        if (event.type == 'message') {
            var inputFile = `./dic/level-${event.message.text}.csv`;

            var parser = parse({ delimiter: ';' }, function(err, data) {
                //console.log(data)
                var index = Math.floor(Math.random() * (data.length));
                console.log(data[index])

                var headers = {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + LINE_CHANNEL_ACCESS_TOKEN
                }
                var body = {
                    replyToken: event.replyToken,
                    messages: [{
                        type: 'text',
                        text: `${data[index][1]} ${data[index][2]}`
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
            })
            fs.createReadStream(inputFile).pipe(parser);
        }
    }
});


var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);
server.listen(port)
server.on('error', onError);

function onError(error) {
    console.error(error)
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ?
        'Pipe ' + port :
        'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

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