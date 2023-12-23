import express from 'express'
import cookieParser from 'cookie-parser'
import path from 'path'

import { backendTodoService } from './services/backend.todo.service.js'
import { backendLoggerService } from './services/backend.logger.service.js'

const app = express()

// Config the Express App
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

// List
app.get('/api/todo/:userId', (req, res) => {
    const { title = '', sort = 'name', list = 'all' } = req.query
    const { userId = '' } = req.params

    const filterAndSort = {
        title,
        sort,
        list,
        userId,
    }

    // if (req.query.pageIdx) filterBy.pageIdx = req.query.pageIdx
    backendTodoService.query(filterAndSort)
        .then(todos => {
            res.send(todos)
        })
})

// Read
app.get('/api/todo/:userId/:todoId', (req, res) => {
    const { todoId } = req.params

    backendTodoService.getById(todoId)
        .then(todo => {
            res.send(todo)
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(401).send('Cannot get todo')
        })
})

// Delete
app.delete('/api/todo/:userId/:todoId', (req, res) => {
    const { loginToken } = req.cookies
    const loggedinUser = userService.validateToken(loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot delete todo')

    const { todoId } = req.params

    backendTodoService
        .remove(todoId, loggedinUser)
        .then(() => res.send('Removed!'))
        .catch((err) => {
            console.log('err', err)
            res.status(401).send(err)
        })
})

// Create
app.post('/api/todo', (req, res) => {
    const { loginToken } = req.cookies
    const loggedinUser = userService.validateToken(loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot add todo')

    const todo = req.body
    delete loggedinUser.username
    todo.creator = loggedinUser

    backendTodoService.save(todo)
        .then((addedtodo) => {
            res.send(addedtodo)
        })
})

// Update
app.put('/api/todo', (req, res) => {
    const { loginToken } = req.cookies
    const loggedinUser = userService.validateToken(loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot update todo')

    const todo = req.body
    backendTodoService.save(todo, loggedinUser)
        .then(savedtodo => {
            res.send(savedtodo)
        })
        .catch((err) => {
            console.log('Had issues:', err)
        })
})

// USER
app.get('/api/user', (req, res) => {
    userService
        .query()
        .then((users) => res.send(users))
        .catch((err) => res.status(500).send('Cannot get todos'))
})

app.get('/api/user/:userId', (req, res) => {
    const { userId } = req.params

    userService
        .getById(userId)
        .then((user) => res.send(user))
        .catch((err) => {
            backendLoggerService.error('get users fail', err)
            res.status(500).send('Cannot get users')
        })
})

app.put('/api/user/:userId', (req, res) => {
    const userToUpdate = {
        _id: req.body._id,
        username: req.body.username,
        password: req.body.password,
        fullname: req.body.fullname,
        activites: req.body.activites,
        todosComplete: req.body.todosComplete,
    }
    backendUserService.save(userToUpdate)
        .then(user => res.send(user))
        .catch((err) => {
            backendLoggerService.error('save fail', err)
            res.status(400).send('failure')
        })
})

app.delete('/api/user/:userId', (req, res) => {
    const { userId } = req.params
    backendTodoService
        .hastodos(userId)
        .then(() => {
            userService
                .remove(userId)
                .then(() => res.send('Removed!'))
                .catch((err) => res.status(401).send(err))
        })
        .catch((err) => res.status(401).send('Cannot delete user with todos'))
})

// Autherize
app.post('/api/login', (req, res) => {
    console.log('req.body', req.body)
    const credentials = {
        username: req.body.username,
        password: req.body.password,
    }
    // const credentials = req.body
    userService.checkLogin(credentials)
        .then((user) => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)

                res.send(user)
            } else {
                res.status(401).send('Invalid credentials')
            }
        })
        .catch((err) => res.status(401).send(err))
})

app.post('/api/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('Logged out')
})

app.post('/api/signup', (req, res) => {
    const credentials = req.body

    userService.save(credentials).then((user) => {
        const loginToken = userService.getLoginToken(user)
        res.cookie('loginToken', loginToken)
        res.send(user)
    })
})

// Fallback route
app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

const port = 3031

app.listen(port, () => {
    console.log(`Server is ready at ${port} http://127.0.0.1:${port}/`)
})