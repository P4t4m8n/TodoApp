
const { createStore } = Redux

const initialState = {
    todos: []
}

function todoReducer(state = initialState, action = {}) {

    switch (action.type) {

        default: return state
    }
}

export const store = createStore(todoReducer)