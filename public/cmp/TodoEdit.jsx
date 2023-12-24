import { todoService } from "../services/todo.service.js"
import { userService } from "../services/user.service.js"
import { ADD_TODO, EDIT_TODO } from "../store/store.js"

const { useNavigate, useParams } = ReactRouterDOM
const { useState, useEffect } = React
const { useDispatch } = ReactRedux


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
        let value = target.value
        setTodoToEdit(value)

    }


    function onSetIsDone() {
        setTodoToEdit((prevTodo) => ({ ...prevTodo, isDone: !todoToEdit.isDone }))
    }

    function onSetIsActive() {
        setTodoToEdit((prevTodo) => ({ ...prevTodo, isActive: !todoToEdit.isActive }))
    }

    function onSaveTodo(ev) {
        console.log('hi')
        ev.preventDefault()
        const type = (todoToEdit._id) ? EDIT_TODO : ADD_TODO
        const activity = (type === EDIT_TODO) ? 'edit todo id: ' + todoToEdit._id : 'add todo'
        userService.addActivity(activity)
        todoService.save(todoToEdit, params.userId)
            .then((savedTodo) => {
                dispatch({ type: type, todo: savedTodo })
                console.log('Saved')
                navigate('/todo/' + params.todoId)
            })
            .catch((err) => {
                console.log('err:', err)
            })

    }

    const { txt } = todoToEdit

    return (
        <section className="edit-todo">

            <form >
                <label htmlFor="txt">Todo Title: </label>
                <input value={todoToEdit.txt} onChange={handleChange} id="txt" type="text" name="txt"></input>
            </form>
            <div className="edit-todo-btns">
                <button type="button" onSubmit={onSaveTodo}>Save</button>
                <button type="button" onClick={onSetIsDone}>Mark as done</button>
                <button type="button" onClick={onSetIsActive}>Mark as non Active</button>
            </div>
        </section>
    )


}