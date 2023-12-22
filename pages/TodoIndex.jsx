import { TodoFilter } from "../cmp/TodoFilter.jsx"
import { TodoList } from "../cmp/TodoList.jsx"
import { todoService } from "../services/todo.service.js"
import { REMOVE_TODO, SET_TODOS } from "../store/store.js"

const { useSelector, useDispatch } = ReactRedux
const { useState, useEffect } = React
const { Link } = ReactRouterDOM

export function TodoIndex() {

    // const [todos, setTodos] = useState(null)
    const todos = useSelector(storeState => storeState.todos)
    const [filterSortBy, setFilterSortBy] = useState(todoService.getDefaultFilter())

    const dispatch = useDispatch()

    useEffect(() => {
        todoService.query(filterSortBy)
            .then(todos => {
                dispatch({ type: SET_TODOS, todos })
            })
            .catch(err => console.log('err:', err))
    }, [filterSortBy])

    function onSetFilterSort(ev) {
        console.log("ev:", ev)

    }

    function handleChange({ target }) {
        const value = target.value
        const objName = target.name
        setFilterSortBy((prevFilter) => ({ ...prevFilter, [objName]: value }))
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
                <TodoFilter onSetFilterSort={onSetFilterSort} handleChange={handleChange} filterTitle={filterSortBy.title} />
                <Link to="/todo/edit">Add</Link>
            </section>
            <TodoList todos={todos} onRemoveTodo={onRemoveTodo}></TodoList>
        </section>
    )
}