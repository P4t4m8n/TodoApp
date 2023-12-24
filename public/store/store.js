
import { appReducer } from "./reducers/app.reducer.js"
import { todoReducer } from "./reducers/todo.reducer.js"
import { userReducer } from "./reducers/user.reducer.js"

const { createStore, combineReducers, compose } = Redux

const rootReducer = combineReducers({
    todoMoudle: todoReducer,
    userMoudle: userReducer,
    appMoudle: appReducer,
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const store = createStore(rootReducer, composeEnhancers())

window.gStore = store





