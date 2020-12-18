const express = require('express')
const app = express()
const port = 8000
var kintoneRouter = require('./routes/kintone')
var letsignRouter = require('./routes/letsign')

app.use(express.json())

app.use('/', kintoneRouter)
app.use('/callback', letsignRouter)

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send('invalid token...')
    }
})

app.listen(port)