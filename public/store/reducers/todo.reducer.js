import { userService } from "../../services/user.service.js"

export const SET_TODOS = 'SET_TODOS'
export const ADD_TODO = 'ADD_TODO'
export const REMOVE_TODO = 'REMOVE_TODO'
export const EDIT_TODO = 'EDIT_TODO'

const initialState = {
    todos: [],
    userObj: userService.getLoggedinUser()
}

export function todoReducer(state = initialState, action = {}) {
    
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

        default:
            return state


    }
}
