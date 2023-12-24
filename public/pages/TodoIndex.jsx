import { TodoFilter } from "../cmp/TodoFilter.jsx"
import { TodoList } from "../cmp/TodoList.jsx"
import { loadTodos, removeTodo } from "../store/actions/todo.actions.js"
import { FILTER } from "../store/reducers/app.reducer.js"

const { useSelector, useDispatch } = ReactRedux
const {  useEffect } = React
const { useParams, Link } = ReactRouterDOM

export function TodoIndex() {

    const params = useParams()
    const dispatch = useDispatch()

    const userId = params.userId
    const todos = useSelector(storeState => storeState.todoMoudle.todos)
    const currentFilterBy = useSelector(storeState => storeState.appMoudle.currentFilterBy)
    // userObjconst user = useSelector(storeState => storeState.userMoudle.userObj)


    useEffect(() => {
        loadTodos()
            .catch(err => console.log('err:', err))
    }, [currentFilterBy])


    function onRemoveTodo(todoId) {
        removeTodo(todoId)
            .then(() => console.log('Removed!'))
            .catch((err) => console.log('err:', err))
    }

    function handleChange({ target }) {
        const value = target.value
        const objName = target.name

        dispatch({ type: FILTER, tempObj: { [objName]: value } })
    }

    if (!todos) return <div>Loading...</div>

    return (
        <section className="todo-index">
            <section className="todo-index-header">
                <TodoFilter handleChange={handleChange} filterTitle={currentFilterBy.title} />
                <Link to={`/todo/${userId}/edit`}>Add</Link>
            </section>
            <TodoList todos={todos} onRemoveTodo={onRemoveTodo} userId={userId}></TodoList>
        </section>
    )
}