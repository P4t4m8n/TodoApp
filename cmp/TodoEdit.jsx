import { todoService } from "../services/todo.service.js"
import { ADD_TODO, EDIT_TODO } from "../store/store.js"

const { useNavigate, useParams } = ReactRouterDOM
const { useState, useEffect } = React
const { useSelector, useDispatch } = ReactRedux


export function TodoEdit() {

    const dispatch = useDispatch()

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
        let value = target.value

        if (field === 'title') {
            setTodoToEdit((prevTodo) => ({ ...prevTodo, title: value }))
        }
        else {
            setTodoToEdit((prevTodo) => ({ ...prevTodo, todosList: todosList.toSpliced(field, 1, value) }))
        }

    }

    function addInnerTodo(ev) {
        ev.preventDefault()
        setTodoToEdit((prevTodo) => ({ ...prevTodo, todosList: todosList.toSpliced(todosList.length, 1, 'Im a new Todo') }))
    }

    function removeInnerTodo({ target }) {
        let idx = target.name
        setTodoToEdit((prevTodo) => ({ ...prevTodo, todosList: todosList.toSpliced(idx, 1) }))
    }

    function onSaveTodo(ev) {
        ev.preventDefault()
        const type = (todoToEdit._id) ? EDIT_TODO : ADD_TODO

        todoService.save(todoToEdit)
            .then((savedTodo) => {
                dispatch({ type: type, todo: savedTodo })
                console.log('Saved')
                navigate('/todo')
            })
            .catch((err) => {
                console.log('err:', err)
            })

    }

    const { title, todosList } = todoToEdit

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
                                <button onClick={removeInnerTodo}>Remove</button>

                            </li>)
                    }
                </ul >
                <button>Save</button>
                <button onClick={addInnerTodo}>Add Todo</button>
            </form>
        </section>
    )


}