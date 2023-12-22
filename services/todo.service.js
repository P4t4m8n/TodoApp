
import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'
import { userService } from './user.service.local.js'

const TODOS_KEY = 'todoDB'
_createTodos()

export const todoService = {
    query,
    get,
    remove,
    save,
    getEmptytodo,
    getDefaultFilter,
    getDoneTodoPercentage,

}

function query(filterBy, userId) {
    console.log("userId:", userId)

    const { title, sort, list } = filterBy
    return storageService.query(TODOS_KEY)
        .then(todos => {
            console.log("todos:", todos)
            todos = todos.filter(todo => todo.owner === userId)

            console.log("todos:", todos)
            if (title) {
                const regex = new RegExp(title, 'i')
                todos = todos.filter(todo => regex.test(todo.title))
            }

            if (list === 'active') {
                todos = todos.filter(todo => todo.isActive)
            }

            if (list === 'done') {
                console.log("done:")
                todos = todos.filter(todo => todo.isDone)
            }

            if (sort === 'length') {
                todos.sort((todoA, todoB) => todoA.todosList.length - todoB.todosList.length)
            }

            else {
                todos.sort((todoA, todoB) => todoA.title.localeCompare(todoB.title))
            }

            return todos
        })
}

function get(todoId) {
    console.log("todoId:", parseInt(todoId))
    return storageService.get(TODOS_KEY, todoId)
}

function remove(todoId) {
    return storageService.remove(TODOS_KEY, todoId)
}



function save(todo) {
    if (todo._id) {
        return storageService.put(TODOS_KEY, todo)
    } else {
        todo.owner = userService.getLoggedinUser()._id
        return storageService.post(TODOS_KEY, todo)
    }
}

function getEmptytodo() {
    return {
        id: '',
        title: '',
        todosList: [],
        isActive: true,
        isDone: false,
        owner: '',
    }
}

function getDefaultFilter() {
    return {
        title: '', sort: 'name', list: 'all',
    }
}

function getDoneTodoPercentage(todos) {
    console.log("todos:", todos)
    var length = todos.length
    var doneTodos = todos.reduce((sum, todo) => {
        if (todo.isDone || !todo.isActive) sum + 1
    })
    var res = 0
    console.log("res:", res)
    if (!doneTodos) doneTodos = 1
    if (length) res = doneTodos / length
    return res
}


function _createTodos() {
    let todos = utilService.loadFromStorage(TODOS_KEY)

    if (!todos || !todos.length) {

        const todos = [
            {
                _id: utilService.makeId(), title: 'z', todosList: ['Task 1', 'Task 2', 'Task 3'],
                isActive: true, isDone: true, owner: "lZJuP",
            },
            {
                _id: utilService.makeId(), title: 'b', todosList: ['Task A', 'Task B'],
                isActive: true,
                isDone: true, owner: "lZJuP",
            },
            {
                _id: utilService.makeId(), title: 'c', todosList: ['Complete project', 'Review code'],
                isActive: true,
                isDone: true, owner: "lZJuP",
            },
            {
                _id: utilService.makeId(), title: 'k', todosList: ['Read a book', 'Go for a walk'],
                isActive: false,
                isDone: false, owner: "lZJuP",

            },
            {
                _id: utilService.makeId(), title: 'e', todosList: ['Prepare presentation', 'Attend meeting'],
                isActive: true,
                isDone: true, owner: "lZJuP",
            },
            {
                _id: utilService.makeId(), title: 'f', todosList: ['Write blog post', 'Research topic'],
                isActive: true,
                isDone: false, owner: "lcBoI",
            },
            {
                _id: utilService.makeId(), title: 'g', todosList: ['Exercise', 'Plan the week'],
                isActive: true,
                isDone: false, owner: "lcBoI",
            },
            {
                _id: utilService.makeId(), title: 'h', todosList: ['Learn new technology', 'Solve coding challenges'],
                isActive: true,
                isDone: false, owner: "lcBoI",
            },
            {
                _id: utilService.makeId(), title: 'i', todosList: ['Shopping', 'Cook dinner'],
                isActive: true,
                isDone: false,
            },
            {
                _id: utilService.makeId(), title: 'j', todosList: ['Listen to music', 'Relax'],
                isActive: true,
                isDone: false,
            }
        ]

        utilService.saveToStorage(TODOS_KEY, todos)
    }
}

