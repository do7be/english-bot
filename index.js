const LINE_CHANNEL_ACCESS_TOKEN = process.env.ACCESS_TOKEN
const MY_ID = process.env.MY_ID

const fs = require('fs')
const parse = require('csv-parse')
const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
const http = require('http')
const server = http.createServer(app)
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())

app.post('/webhook', function(req, res, next) {
    res.status(200).end()
    for (const event of req.body.events) {
        if (event.type == 'message') {
            const inputFile = `./dic/level-${event.message.text}.csv`

            const parser = parse({ delimiter: ';' }, function(err, data) {
                const index = Math.floor(Math.random() * (data.length))

                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + LINE_CHANNEL_ACCESS_TOKEN
                }
                const body = {
                    replyToken: event.replyToken,
                    messages: [{
                        type: 'text',
                        text: `${data[index][1]} ${data[index][2]}`
                    }]
                }
                const url = 'https://api.line.me/v2/bot/message/reply'
                request({
                    url: url,
                    method: 'POST',
                    headers: headers,
                    body: body,
                    json: true
                })
            })
            fs.createReadStream(inputFile).pipe(parser)
        }
    }
})

app.get('/', function(req, res, next) {
    res.status(200).end()
    const inputFile = `./dic/level-04.csv`

    const parser = parse({ delimiter: ';' }, function(err, data) {
        const headers = {
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
        const body = {
            to: MY_ID,
            messages: words
        }
        const url = ' https://api.line.me/v2/bot/message/push'
        request({
            url: url,
            method: 'POST',
            headers: headers,
            body: body,
            json: true
        })
    })
    fs.createReadStream(inputFile).pipe(parser)
})


const port = normalizePort(process.env.PORT || '3000')
app.set('port', port)
server.listen(port)
server.on('error', onError)

function onError(error) {
    console.error(error)
    if (error.syscall !== 'listen') {
        throw error
    }

    const bind = typeof port === 'string' ?
        'Pipe ' + port :
        'Port ' + port

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges')
            process.exit(1)
            break
        case 'EADDRINUSE':
            console.error(bind + ' is already in use')
            process.exit(1)
            break
        default:
            throw error
    }
}

function normalizePort(val) {
    const port = parseInt(val, 10)

    if (isNaN(port)) {
        // named pipe
        return val
    }

    if (port >= 0) {
        // port number
        return port
    }

    return false
}