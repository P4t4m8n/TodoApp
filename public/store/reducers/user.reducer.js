import { userService } from "../../services/user.service.js"

export const SET_USER = 'SET_USER'
export const SET_USER_COMPLETE = 'SET_USER_COMPLETE'
export const EDIT_USER = 'EDIT_USER'


const initialState = {
    userObj: userService.getLoggedinUser()
}

export function userReducer(state = initialState, action = {}) {

    switch (action.type) {

        case SET_USER:
            return { ...state, userObj: action.user }

        case SET_USER_COMPLETE:
            const user = { ...state.userObj, todosComplete: action.todosComplete }
            return { ...state, userObj: user }

        case EDIT_USER:
            return { ...state, userObj: action.user }

        default:
            return state
    }
}
