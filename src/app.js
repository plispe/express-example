const R = require('ramda')
const express = require('express')
const httpStatus = require('http-status-codes')
const app = express()
const { v4: uuidv4 } = require('uuid')
const execa = require('execa')

app.use(express.json())

const {PORT: port = 3000} = process.env;

(async () => {
    const users = []
    app.get('/list', async (_, res) => {
        const {stdout} = await execa('ls -la')
        res.send(stdout)
    })
    app.get('/', (_, res) => {
        res.send('ok 2.0!')
    })
    app.get('/users', (req, res) => {
        res.json({data: R.reject(R.isNil, users)})
    })
    app.get('/users/:id', (req, res) => {
        const {id} = req.params
        
        if (!id) {
            res.status(httpStatus.NOT_FOUND).send()
        } else {
            const user = R.find(R.propEq('id', id))(R.reject(R.isNil, users))
            user !== undefined ? res.json(user) : res.status(httpStatus.NOT_FOUND).send()
        }
    })
    app.post('/users', (req, res) => {
        const user = req.body
        user.id = uuidv4()
        users.push(user)


        res 
            .set('Location', `/users/${user.id}`)
            .status(httpStatus.CREATED)
            .json(user)
    })
    app.put('/users/:id', (req, res) => {
        const {id} = req.params

        const userIndex = R.findIndex(R.propEq('id', id))(R.reject(R.isNil, users))

        if (userIndex === -1) {
            res.status(httpStatus.NOT_FOUND).send()
        } else {
            const userIndex = R.findIndex(R.propEq('id', id))(users)
            
            users[userIndex] = R.merge(req.body, {id:  users[userIndex].id})
            res.status(httpStatus.OK).send(users[userIndex])
        }
    })
    app.patch('/users/:id', (req, res) => {
        const {id} = req.params

        const userIndex = R.findIndex(R.propEq('id', id))(R.reject(R.isNil, users))

        if (userIndex === -1) {
            res.status(httpStatus.NOT_FOUND).send()
        } else {
            // get user index 
            const userIndex = R.findIndex(R.propEq('id', id))(users)

            let user = users[userIndex]
            user = R.mergeDeepRight(user, req.body)

            // save to db
            users[userIndex] = user
            res.status(httpStatus.OK).send(user)
        }
    })
    app.delete('/users/:id', (req, res) => {
        const {id} = req.params

        const userIndex = R.findIndex(R.propEq('id', id))(R.reject(R.isNil, users))

        if (userIndex === -1) {
            res.status(httpStatus.NOT_FOUND).send()
        } else {
            const userIndex = R.findIndex(R.propEq('id', id))(users)
            
            delete users[userIndex]
            res.status(httpStatus.NO_CONTENT).send()
        }
    })

    await app.listen(port)
    console.log(`Example app listening at http://localhost:${port}`)
})()


