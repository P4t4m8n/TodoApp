import { todoService } from "../../services/todo.service.js"

export const FILTER = 'FILTER'
export const LOADING = 'LOADING'

const initialState = {
    isLoading: false,
    currentFilterBy: todoService.getDefaultFilter(),
}
export function appReducer(state = initialState, action = {}) {
    switch (action.type) {

        case FILTER:
            let currentFilterBy = { ...state.currentFilterBy, ...action.tempObj }
            return { ...state, currentFilterBy }

        default:
            return state

    }

}