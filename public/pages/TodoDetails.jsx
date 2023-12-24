// import { todoService } from "../services/todo.service.js"
import { loadTodo } from "../store/actions/todo.actions.js"

const { useParams, useNavigate } = ReactRouterDOM
const { useState, useEffect } = React

export function TodoDetails() {

    const [todo, setTodo] = useState(null)
    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        loadTodo(params.todoId)
            .then(todo => {
                console.log("todo:", todo)
                setTodo(todo)
            })
            .catch(err => {
                console.log('err:', err)
                navigate('/todo/' + params.userId)
            })
    }, [])

    if (!todo) return <div>Loading...</div>

    function onBack() {
        navigate('/todo/' + params.userId)
    }


    return (
        <section className="todo-details">
            <header>{todo.txt}</header>

            <button onClick={onBack}>Back</button>
        </section>
    )
}