import { todoService } from "../services/todo.service.js"

const { useParams, useNavigate } = ReactRouterDOM
const { useState, useEffect } = React

export function TodoDetails() {

    const [todo, setTodo] = useState(null)
    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        todoService.get(params.todoId, params.userId)
            .then(todo =>
                setTodo(todo))
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