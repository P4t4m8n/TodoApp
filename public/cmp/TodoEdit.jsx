import { todoService } from "../services/todo.service.js"
// import { userService } from "../services/user.service.js"
import { loadTodo, saveTodo } from "../store/actions/todo.actions.js"
// import { ADD_TODO, EDIT_TODO } from "../store/reducers/todo.reducer.js"

const { useNavigate, useParams } = ReactRouterDOM
const { useState, useEffect } = React
const { useDispatch } = ReactRedux


export function TodoEdit() {

    // const dispatch = useDispatch()

    const [todoToEdit, setTodoToEdit] = useState(todoService.getEmptytodo())
    const params = useParams()
    const navigate = useNavigate()


    useEffect(() => {
        if (params.todoId) {
            loadTodo(params.todoId)
                .then(todo => setTodoToEdit(todo))
                .catch(err => {
                    console.log('err:', err)
                    navigate('/todo')
                })

        }
    }, [])

    function handleChange({ target }) {
        let value = target.value
        setTodoToEdit((prevTodo) => ({ ...prevTodo, txt: value }))
    }


    function onSetIsDone() {
        setTodoToEdit((prevTodo) => ({ ...prevTodo, isDone: !todoToEdit.isDone }))
    }

    function onSetIsActive() {
        setTodoToEdit((prevTodo) => ({ ...prevTodo, isActive: !todoToEdit.isActive }))
    }

    function onSaveTodo(ev) {
        ev.preventDefault()
        saveTodo(todoToEdit)
            .then(() => {
                navigate('/todo/' + params.userId)
            })
            .catch((err) => {
                console.log('err:', err)
            })

    }
    function onBack() {
        navigate('/todo/' + params.userId)
    }


    return (
        <section className="edit-todo">

            <form >
                <label htmlFor="txt">Todo Title: </label>
                <input value={todoToEdit.txt} onChange={handleChange} id="txt" type="text" name="txt"></input>
            </form>
            <div className="edit-todo-btns">
                <button onClick={onSaveTodo}>Save</button>
                <button onClick={onBack}>Back</button>
                <button onClick={onSetIsDone}>Mark as done</button>
                <button onClick={onSetIsActive}>Mark as non Active</button>
            </div>
        </section>
    )


}