const LINE_CHANNEL_ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const MY_ID = process.env.MY_ID;

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
    console.log(req.body)
    for (var event of req.body.events) {
        console.log(event)
        console.log(event.source)
        if (event.type == 'message') {
            var inputFile = `./dic/level-${event.message.text}.csv`;

            var parser = parse({ delimiter: ';' }, function(err, data) {
                var index = Math.floor(Math.random() * (data.length))
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
                var url = 'https://api.line.me/v2/bot/message/reply'
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
})

app.get('/', function(req, res, next) {
    res.status(200).end();
    var inputFile = `./dic/level-04.csv`;

    var parser = parse({ delimiter: ';' }, function(err, data) {
        var headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + LINE_CHANNEL_ACCESS_TOKEN
        }
        let words = [{
            type: 'text',
            text: `おはようございます。本日もはりきって英単語を覚えましょう！`
        }]
        for (let i = 0; i < 3; i++) {
            const index = Math.floor(Math.random() * (data.length))
            words.push({
                type: 'text',
                text: `${data[index][1]} ${data[index][2]}`
            })
        }
        var body = {
            to: MY_ID,
            messages: words
        }
        console.log(body)
        var url = ' https://api.line.me/v2/bot/message/push'
        request({
            url: url,
            method: 'POST',
            headers: headers,
            body: body,
            json: true
        });
    })
    fs.createReadStream(inputFile).pipe(parser);
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