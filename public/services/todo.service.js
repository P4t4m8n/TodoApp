
export const todoService = {
    query,
    get,
    remove,
    save,
    getEmptytodo,
    getDefaultFilter,
    getDoneTodoPercentage,

}

const BASE_URL = '/api/todo/'

function query(filterBy, userId) {

    const filterAndSort = { ...filterBy, userId }
    return axios.get(BASE_URL + userId, { params: filterAndSort })
        .then(res => res.data)

}

function get(todoId,userId) {
 
    const url = BASE_URL + userId + '/' + todoId
    return axios.get(url)
        .then(res => res.data)
}

function remove(todoId,userId) {
    const url = BASE_URL + userId + '/' + todoId
    return axios.delete(url)
}




function save(todo,userId) {
    let url = BASE_URL + userId + '/edit'
    let method
    if (todo._id) {
        method = 'put'
        url += '/' + todo._id
    }
    else {
        method = 'post'
    }
    todo.owner = userId
    return axios[method](url, todo).then(res => res.data)

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
    if (!doneTodos) doneTodos = 1
    if (length) res = doneTodos / length
    return res
}


