import { todoService } from "../services/todo.service.js"

const { useNavigate, useParams } = ReactRouterDOM
const { useState, useEffect } = React

export function TodoEdit() {

    const [todoToEdit, setTodoToEdit] = useState(todoService.getEmptytodo())
    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (params.todoId) {
            todoService.get(params.todoId)
                .then(todo => setTodoToEdit(todo))
                .catch(err => {
                    console.log('err:', err)
                    navigate('/todo')
                })
        }
    }, [])

    function handleChange({ target }) {
        let field = target.name
        console.log("field:", field)
        let value = target.value
        console.log("value:", value)

        if (field === 'title') {
            setTodoToEdit((prevTodo) => ({ ...prevTodo, title: value }))
        }
        else {
            setTodoToEdit((prevTodo) => ({ ...prevTodo, todosList: todosList.toSpliced(field, 1, value) }))
        }

    }

    function addTodo(ev) {
        ev.preventDefault()
        setTodoToEdit((prevTodo) => ({ ...prevTodo, todosList: todosList.toSpliced(todosList.length, 1, 'Im a new Todo') }))
    }

    function removeTodo({ target }) {
        let idx = target.name
        setTodoToEdit((prevTodo) => ({ ...prevTodo, todosList: todosList.toSpliced(idx, 1) }))
    }

    function onSaveTodo(ev) {
        ev.preventDefault()
        todoService.save(todoToEdit)
            .then(() => {
                console.log('Saved')
                navigate('/todo')
            })
            .catch((err) => {
                console.log('err:', err)
            })

    }

    const { title, todosList } = todoToEdit
    console.log("todoToEdit:", todoToEdit)
    console.log("title:", title)
    console.log("todosList:", todosList)

    return (
        <section className="editTodo">

            <form onSubmit={onSaveTodo}>
                <label htmlFor="title">Todo Title: </label>
                <input value={title} onChange={handleChange} type="text" id="title" name="title"></input>
                <ul className="todo-edit-list">
                    {
                        todosList.map((todo, idx) =>
                            <li key={idx}>
                                <label htmlFor={idx}>Todo {idx + 1}: </label>
                                <input value={todo} onChange={handleChange}
                                    type="text" id={idx} name={idx}></input>
                                <button onClick={removeTodo}>Remove</button>

                            </li>)
                    }
                </ul >
                <button>Save</button>
                <button onClick={addTodo}>Add Todo</button>
            </form>
        </section>
    )


}