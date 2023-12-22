import { TodoFilter } from "../cmp/TodoFilter.jsx"
import { TodoList } from "../cmp/TodoList.jsx"
import { todoService } from "../services/todo.service.js"
import { FILTER, REMOVE_TODO, SET_TODOS } from "../store/store.js"

const { useSelector, useDispatch } = ReactRedux
const { useState, useEffect } = React
const { Link } = ReactRouterDOM

export function TodoIndex() {

    const todos = useSelector(storeState => storeState.todos)
    const currentFilterBy = useSelector(storeState => storeState.currentFilterBy)

    const dispatch = useDispatch()

    useEffect(() => {
        todoService.query(currentFilterBy)
            .then(todos => {
                dispatch({ type: SET_TODOS, todos })
            })
            .catch(err => console.log('err:', err))
    }, [currentFilterBy])

    function handleChange({ target }) {
        const value = target.value
        const objName = target.name
        dispatch({ type: FILTER, tempObj:{[objName]: value }})
    }

    function onRemoveTodo(todoId) {
        todoService.remove(todoId)
            .then(() => {
                dispatch({ type: REMOVE_TODO, todoId })
                console.log('Removed!')
            })
            .catch((err) => console.log('err:', err))
    }

    if (!todos) return <div>Loading...</div>
    return (
        <section className="todo-index">
            <section className="todo-index-header">
                <TodoFilter handleChange={handleChange} filterTitle={currentFilterBy.title} />
                <Link to="/todo/edit">Add</Link>
            </section>
            <TodoList todos={todos} onRemoveTodo={onRemoveTodo}></TodoList>
        </section>
    )
}