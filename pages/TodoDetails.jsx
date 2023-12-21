import { todoService } from "../services/todo.service.js"

const { useParams, useNavigate } = ReactRouterDOM
const { useState, useEffect } = React

export function TodoDetails() {

    const [todo, setTodo] = useState(null)
    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        todoService.get(params.todoId)
            .then(todo =>
                setTodo(todo))
            .catch(err => {
                console.log('err:', err)
                navigate('/todo')
            })
    })

    if (!todo) return <div>Loading...</div>

    function onBack() {
        navigate('/todo')

    }


    return (
        <section className="todo-details">
            <header>{todo.title}</header>
            <ul className="todos-details-list">
                {
                    todo.todosList.map((todoList, idx) =>
                        <li className="todo-details-list" key={idx}>
                            {todoList}
                        </li>)
                }
            </ul>
            <button onClick={onBack}>Back</button>
        </section>
    )
}