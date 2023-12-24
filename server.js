import express from 'express'
import cookieParser from 'cookie-parser'
import path from 'path'

import { backendTodoService } from './services/backend.todo.service.js'
import { backendLoggerService } from './services/backend.logger.service.js'
import { backendUserService } from './services/backend.user.service.js'

const app = express()

// Config the Express App
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

// TODOS

// list
app.get('/api/todo/:userId', (req, res) => {
    // const { loginToken } = req.cookies
    // const loggedinUser = backendUserService.validateToken(loginToken)
    // if (!loggedinUser) {
    //     backendLoggerService.error('Cannot delete todo', err)
    //     return res.status(401).send('Cannot delete todo')
    // }

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

// read
app.get('/api/todo/:userId/:todoId', (req, res) => {

    // const { loginToken } = req.cookies
    // const loggedinUser = backendUserService.validateToken(loginToken)
    // if (!loggedinUser) {
    //     backendLoggerService.error('Cannot delete todo', err)
    //     return res.status(401).send('Cannot delete todo')
    // }

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

// delete
app.delete('/api/todo/:userId/:todoId', (req, res) => {
    // const { loginToken } = req.cookies
    // const loggedinUser = backendUserService.validateToken(loginToken)
    // if (!loggedinUser) {
    //     backendLoggerService.error('Cannot delete todo', err)
    //     return res.status(401).send('Cannot delete todo')
    // }

    const loggedinUser = { _id: req.params.userId }
    const { todoId } = req.params

    backendTodoService
        .remove(todoId, loggedinUser)
        .then(() => res.send('Removed!'))
        .catch((err) => {
            console.log('err', err)
            res.status(401).send(err)
        })
})

// create
app.post('/api/todo/:userId/edit', (req, res) => {
    console.log("req:", req.body)
    // const { loginToken } = req.cookies
    // const loggedinUser = userService.validateToken(loginToken)
    // if (!loggedinUser) {
    //     backendLoggerService.error('Cannot add todo')
    //     return res.status(401).send('Cannot add todo')
    // }

    const loggedinUser = { _id: req.params.userId }
    const todo = {
        title: req.body.title || '',
        todosList: req.body.todosList || [],
        isActive: req.body.isActive || true,
        isDone: req.body.isDone || false,
        owner: req.params.userId
    }
    // delete loggedinUser.username
    // todo.creator = loggedinUser

    backendTodoService.save(todo, loggedinUser)
        .then((addedtodo) => {
            res.send(addedtodo)
        })
        .catch((err) => {
            backendLoggerService.error('unable to save', err)
        })
})

// update
app.put('/api/todo/:userId/edit/:todoId', (req, res) => {
    // const { loginToken } = req.cookies
    // const loggedinUser = userService.validateToken(loginToken)
    // if (!loggedinUser) {
    //     backendLoggerService.error('Cannot update todo')
    //     return res.status(401).send('Cannot update todo')
    // }

    const loggedinUser = { _id: req.params.userId }
    const todo = {
        _id: req.params.todoId,
        title: req.body.title || '',
        todosList: req.body.todosList || [],
        isActive: req.body.isActive,
        isDone: req.body.isDone,
        owner: req.params.userId
    }

    backendTodoService.save(todo, loggedinUser)
        .then(savedtodo => {
            res.send(savedtodo)
        })
        .catch((err) => {
            backendLoggerService.error('unable to save', err)
        })
})

// USER

//get users (admin only noy fun atm)

app.get('/api/user', (req, res) => {
    userService
        .query()
        .then((users) => res.send(users))
        .catch((err) => res.status(500).send('Cannot get todos'))
})

// user profile
app.get('/api/user/:userId', (req, res) => {
    const { userId } = req.params

    backendUserService
        .getById(userId)
        .then((user) => res.send(user))
        .catch((err) => {
            backendLoggerService.error('get users fail', err)
            res.status(500).send('Cannot get users')
        })
})

//update user
app.put('/api/user/:userId', (req, res) => {
    const userToUpdate = {
        _id: req.params.userId,
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


//delete user (admin only noy fun atm)

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
    const credentials = {
        username: req.body.username,
        password: req.body.password,
    }

    backendUserService.checkLogin(credentials)
        .then((user) => {
            if (user) {
                const loginToken = backendUserService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                backendLoggerService.error('Invalid credentials', err)
                res.status(401).send('Invalid credentials')
            }
        })
        .catch((err) => res.status(401).send(err))
})

// app.post('/todo/api/logout', (req, res) => {
//     console.log('logout')
//     res.clearCookie('loginToken')
//     res.send('Logged out')
// }
// )
app.post('/api/logout', (req, res) => {
    console.log('logout')
    res.clearCookie('loginToken')
    res.send('Logged out')
})

app.post('/api/signup', (req, res) => {
    const credentials = {
        username: req.body.username,
        password: req.body.password,
        fullname: req.body.fullname,
        activites: req.body.activites,
        todosComplete: req.body.todosComplete

    }

    backendUserService.signup(credentials).then((user) => {
        const loginToken = backendUserService.getLoginToken(user)
        res.cookie('loginToken', loginToken)
        res.send(user)
    })
})

// Fallback route
app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

const PORT = process.env.PORT || 3031

app.listen(PORT, () => {
    console.log(`Server is ready at ${PORT} http://127.0.0.1:${PORT}/`)
})