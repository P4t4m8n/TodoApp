
import { todoService } from "../../services/todo.service.js"
import { userService } from "../../services/user.service.js"
import { REMOVE_TODO, SET_TODOS, ADD_TODO,EDIT_TODO } from "../reducers/todo.reducer.js"
import { store } from "../store.js"



export function loadTodos() {
    // store.dispatch({ type: SET_IS_LOADING, isLoading: true })

    const filterBy = store.getState().appMoudle.currentFilterBy
    const userId = store.getState().userMoudle.userObj._id
  

    return todoService.query(filterBy, userId)
        .then(todos => {
            console.log("todos:", todos)
            store.dispatch({ type: SET_TODOS, todos })
        })
        .catch(err => {
            console.log('todo action -> Cannot load todos', err)
            throw err
        })
    // .finally(() => {
    //     // store.dispatch({ type: SET_IS_LOADING, isLoading: false })
    // })

}

export function loadTodo(todoId) {
    const userId = store.getState().userMoudle.userObj._id
    return userService.addActivity('load todo id: ' + todoId)
        .then(() => {
            return todoService.get(todoId, userId)
                .then(todo => {
                    return todo
                })
                .catch(err => {
                    console.log('todo action -> Cannot load todos', err)
                    throw err
                })
                .finally(() => {
                    // store.dispatch({ type: SET_IS_LOADING, isLoading: false })
                })
        })
        .catch(err => {
            console.log(err)
            throw err
        })


}

export function removeTodo(todoId) {
    store.dispatch({ type: REMOVE_TODO, todoId })
    // store.dispatch({ type: SET_IS_LOADING, isLoading: true })
    const userId = store.getState().userMoudle.userObj._id

    return userService.addActivity('removed todo id: ' + todoId)
        .then(() => {
            return todoService.remove(todoId, userId)
                .then(() => console.log('Removed!'))
                .catch((err) => {
                    // store.dispatch({ type: TODO })
                    console.log('todo action -> Cannot remove todo', err)
                    throw err
                })
                .finally(() => {
                    // store.dispatch({ type: SET_IS_LOADING, isLoading: false })
                })
        })
        .catch(err => {
            console.log(err)
            throw err
        })


}

export function saveTodo(todo) {
console.log("todo:", todo)

    const type = (todo._id) ? EDIT_TODO : ADD_TODO
    const activity = (type === EDIT_TODO) ? 'edit todo id: ' + todo._id : 'add todo'

    const userId = store.getState().userMoudle.userObj._id

    return userService.addActivity(activity)
        .then(() => {
            return todoService.save(todo, userId)
                .then((savedTodo) => {
                    dispatch({ type: type, todo: savedTodo })
                    console.log('Saved')
                })
                .catch((err) => {
                    console.log('todo action -> Cannot save todo', err)
                })
                .finally(() => {
                    // store.dispatch({ type: SET_IS_LOADING, isLoading: false })
                })
        })
        .catch(err => {
            console.log(err)
            throw err
        })
}