import fs from 'fs'
import { backendUtilService } from './backend.util.service.js'

export const backendTodoService = {
    query,
    getById,
    remove,
    save,
    hastodos
}

const gTodos = backendUtilService.readJsonFile('data/todo.json')

// const PAGE_SIZE = 10

function query(filterAndSort) {
    const { title, sort, list, userId } = filterAndSort
    var todos = gTodos
    todos = todos.filter(todo => todo.owner === userId)
    // console.log("todos:", todos)

    if (title) {
        const regex = new RegExp(title, 'i')
        todos = todos.filter(todo => regex.test(todo.title))
    }

    if (list === 'active') {
        todos = todos.filter(todo => todo.isActive)
    }

    if (list === 'done') {
        todos = todos.filter(todo => todo.isDone)
    }

    if (sort === 'length') {
        todos.sort((todoA, todoB) => todoA.todosList.length - todoB.todosList.length)
    }

    else {
        todos.sort((todoA, todoB) => todoA.title.localeCompare(todoB.title))
    }

    return Promise.resolve(todos)
}

function save(todo, loggedinUser) {
    if (todo._id) {
        const idx = gTodos.findIndex(currtodo => currtodo._id === todo._id)
        if (idx === -1) return Promise.reject('No such todo')

        if (gTodos[idx].creator._id !== loggedinUser._id && !loggedinUser.isAdmin) {
            return Promise.reject('Not authorized update this car')
        }

        gTodos[idx] = todo
    } else {
        todo._id = _makeId()
        gTodos.push(todo)
    }

    return _savetodosToFile().then(() => todo)
}

function getById(todoId) {
    const todo = gTodos.find(todo => todo._id === todoId)
    return Promise.resolve(todo)
}

function remove(todoId, loggedinUser) {
    const idx = gTodos.findIndex(todo => todo._id === todoId)

    if (idx === -1) return Promise.reject('No such todo')

    if (gTodos[idx].creator._id !== loggedinUser._id && !loggedinUser.isAdmin) {
        return Promise.reject('Not authorized delete this todo')
    }

    gTodos.splice(idx, 1)
    return _savetodosToFile()
}

function hastodos(userId) {
    const hastodos = gTodos.some(todo => todo.creator._id === userId)

    if (hastodos) return Promise.reject('Cannot remove user with todos')

    return Promise.resolve()
}


function _makeId(length = 5) {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    var txt = ''
    for (let i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}

function _savetodosToFile() {
    console.log('gtodos:', gTodos)
    return new Promise((resolve, reject) => {
        fs.writeFile('data/todo.json', JSON.stringify(gTodos, null, 2), (err) => {
            if (err) {
                console.log(err)
                reject('Cannot write to file')
            } else {
                console.log('Wrote Successfully!')
                resolve()
            }
        })
    })
}