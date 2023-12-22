import { todoService } from "../services/todo.service.js"
import { userService } from "../services/user.service.local.js"

const { createStore } = Redux

export const SET_TODOS = 'SET_TODOS'
export const ADD_TODO = 'ADD_TODO'
export const REMOVE_TODO = 'REMOVE_TODO'
export const EDIT_TODO = 'EDIT_TODO'

export const SET_USER = 'SET_USER'
export const SET_USER_COMPLETE = 'SET_USER_COMPLETE'


export const FILTER = 'FILTER'




const initialState = {
    todos: [],
    isLoading: false,
    currentFilterBy: todoService.getDefaultFilter(),
    userObj: userService.getLoggedinUser()
}

function todoReducer(state = initialState, action = {}) {

    let todos
    let user
    let activites
    switch (action.type) {

        //todo

        case SET_TODOS:
            return { ...state, todos: action.todos }

        case ADD_TODO:
            todos = [...state.todos, action.todo]
            return { ...state, todos }

        case REMOVE_TODO:
            todos = state.todos.filter(todo => todo._id !== action.todoId)
            return { ...state, todos }

        case EDIT_TODO:
            todos = state.todos.map(todo => todo._id === action.todo._id ? action.todo : todo)
            return { ...state, todos }

        //Filter

        case FILTER:
            let currentFilterBy = { ...state.currentFilterBy, ...action.tempObj }
            return { ...state, currentFilterBy }

        //Users

        case SET_USER:
            return { ...state, userObj: action.user }

        case SET_USER_COMPLETE:

            console.log("action:", action)
            const user = { ...state.userObj, todosComplete: action.todosComplete }
            console.log("user:", user)
            return { ...state, userObj: user }

        // case ADD_USER_ACTIVITY:
        //     activites = [...state.userObj.activites, action.activty]
        //     user = { ...state.userObj, activites }
        //     return { ...state, user }


        default:
            return state
    }
}

export const store = createStore(todoReducer)

// window.gStore=store