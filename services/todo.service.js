
import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'

const TODOS_KEY = 'todoDB'
_createTodos()

export const todoService = {
    query,
    get,
    remove,
    save,
    getEmptytodo,
    getDefaultFilter,

}

function query(filterBy) {
    const { title, sort } = filterBy
    return storageService.query(TODOS_KEY)
        .then(todos => {
            if (title) {
                const regex = new RegExp(title, 'i')
                todos = todos.filter(todo => regex.test(todo.title))
            }
            if (sort === 'length') {
                console.log(todos)
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
        return storageService.post(TODOS_KEY, todo)
    }
}

function getEmptytodo() {
    return {
        id: '',
        title: '',
        todosList: []
    }
}

function getDefaultFilter() {
    return {
        title: '', sort: 'name'
    }
}



function _createTodos() {
    let todos = utilService.loadFromStorage(TODOS_KEY)

    if (!todos || !todos.length) {

        const todos = [
            { _id: utilService.makeId(), title: 'z', todosList: ['Task 1', 'Task 2', 'Task 3'] },
            { _id: utilService.makeId(), title: 'b', todosList: ['Task A', 'Task B'] },
            { _id: utilService.makeId(), title: 'c', todosList: ['Complete project', 'Review code'] },
            { _id: utilService.makeId(), title: 'k', todosList: ['Read a book', 'Go for a walk'] },
            { _id: utilService.makeId(), title: 'e', todosList: ['Prepare presentation', 'Attend meeting'] },
            { _id: utilService.makeId(), title: 'f', todosList: ['Write blog post', 'Research topic'] },
            { _id: utilService.makeId(), title: 'g', todosList: ['Exercise', 'Plan the week'] },
            { _id: utilService.makeId(), title: 'h', todosList: ['Learn new technology', 'Solve coding challenges'] },
            { _id: utilService.makeId(), title: 'i', todosList: ['Shopping', 'Cook dinner'] },
            { _id: utilService.makeId(), title: 'j', todosList: ['Listen to music', 'Relax'] }
        ]

        utilService.saveToStorage(TODOS_KEY, todos)
    }
}

