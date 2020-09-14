const express = require('express')
const app = express()

const {PORT: port = 3000} = process.env

const users = [];

(async () => {
    app.get('/', (_, res) => {
        res.send('ok!')
    })
    app.get('/users', (req, res) => {
        res.json({data: users})
    })
    app.get('/users/:id', (req, res) => {
        res.send('get detail')
    })
    app.post('/users', (req, res) => {
        res.send('post')
    })
    app.put('/users/:id', (req, res) => {
        res.send('put')
    })
    app.patch('/users/:id', (req, res) => {
        res.send('patch')
    })
    app.delete('/users/:id', (req, res) => {
        res.send('delete')
    })

    await app.listen(port)
    console.log(`Example app listening at http://localhost:${port}`)
})()


