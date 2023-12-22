import { TodoFilter } from "../cmp/TodoFilter.jsx"
import { TodoList } from "../cmp/TodoList.jsx"
import { todoService } from "../services/todo.service.js"
import { userService } from "../services/user.service.local.js"
import { FILTER, REMOVE_TODO, SET_TODOS, SET_USER_COMPLETE } from "../store/store.js"

const { useSelector, useDispatch } = ReactRedux
const { useState, useEffect } = React
const { Link } = ReactRouterDOM

export function TodoIndex() {

    const todos = useSelector(storeState => storeState.todos)
    const currentFilterBy = useSelector(storeState => storeState.currentFilterBy)
    const user = useSelector(storeState => storeState.userObj)

    const dispatch = useDispatch()

    useEffect(() => {
        todoService.query(currentFilterBy, user._id)
            .then(todos => {
                let todosComplete = todoService.getDoneTodoPercentage(todos)
                console.log("todosComplete:", todosComplete)
                dispatch({ type: SET_USER_COMPLETE, todosComplete })
                dispatch({ type: SET_TODOS, todos })
            })
            .catch(err => console.log('err:', err))
    }, [currentFilterBy])

    function handleChange({ target }) {
        const value = target.value

        const objName = target.name

        dispatch({ type: FILTER, tempObj: { [objName]: value } })
    }

    function onRemoveTodo(todoId) {
        userService.addActivity('removed todo id: ' + todoId)
            .then(
                todoService.remove(todoId)
                    .then(() => {
                        dispatch({ type: REMOVE_TODO, todoId })
                        dispatch({ type: REMOVE_TODO, todoId })
                        console.log('Removed!')
                    })
                    .catch((err) => console.log('err:', err)))
    }

    if (!todos) return <div>Loading...</div>
    return (
        <section className="todo-index">
            <section className="todo-index-header">
                <TodoFilter handleChange={handleChange} filterTitle={currentFilterBy.title} />
                <Link to={`/todo/${user._id}/edit`}>Add</Link>
            </section>
            <TodoList todos={todos} onRemoveTodo={onRemoveTodo} userId={user._id}></TodoList>
        </section>
    )
}