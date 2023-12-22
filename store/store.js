import { todoService } from "../services/todo.service.js"

const { createStore } = Redux

export const SET_TODOS = 'SET_TODOS'
export const ADD_TODO = 'ADD_TODO'
export const REMOVE_TODO = 'REMOVE_TODO'
export const EDIT_TODO = 'EDIT_TODO'

export const FILTER = 'FILTER'



const initialState = {
    todos: [],
    isLoading: false,
    currentFilterBy: todoService.getDefaultFilter(),
    userObject: {}
}

function todoReducer(state = initialState, action = {}) {

    let todos
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

        default:
            return state
    }
}

export const store = createStore(todoReducer)

// window.gStore=store