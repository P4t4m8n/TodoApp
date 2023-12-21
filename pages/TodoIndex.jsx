import { TodoFilter } from "../cmp/TodoFilter.jsx"
import { TodoList } from "../cmp/TodoList.jsx"
import { todoService } from "../services/todo.service.js"

const { useState, useEffect } = React
const { Link } = ReactRouterDOM

export function TodoIndex() {

    const [todos, setTodos] = useState(null)
    const [filterSortBy, setFilterSortBy] = useState(todoService.getDefaultFilter())

    useEffect(() => {
        todoService.query()
            .then(todos => setTodos(todos))
            .catch(err => console.log('err:', err))
    }, [])

    function onSetFilterSort(ev) {
        console.log("ev:", ev)

    }

    function handleChange({ target }) {
        console.log("target:", target.value)
        console.log("target:", target.name)
        const value = target.value
        if (target.name === 'sortBy') {
            setFilterSortBy((prevFilter) => ({ ...prevFilter, sort: value }))
        }
        else
            setFilterSortBy((prevFilter) => ({ ...prevFilter, title: value }))
    }

    function onRemoveTodo(todoId) {
        todoService.remove(todoId)
            .then(() => {
                setTodos(prevTodos => {
                    return prevTodos.filter(todo => todo._id !== todoId)
                })
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