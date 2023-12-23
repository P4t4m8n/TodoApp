const { Link } = ReactRouterDOM


export function TodoList({ todos, onRemoveTodo, userId }) {


    return (
        <ul className="todos-container">
            {todos.map(todo =>
                <li className="todo" key={todo._id}>
                    <p>{todo.txt}</p>
                    <div className="todo-status">
                        {todo.isActive && <div className="todo-active">Active</div>}
                        {todo.isDone && <div className="todo-active">Done</div>}
                    </div>
                    <div className="todo-btns">
                        <button onClick={() => onRemoveTodo(todo._id)}><img src='\assets\img\delete.svg'></img></button>
                        <button><Link to={`/todo/${userId}/${todo._id}`}><img src='\assets\img\details.svg'></img></Link></button>
                        <button><Link to={`/todo/${userId}/edit/${todo._id}`}><img src='\assets\img\painting.svg'></img></Link></button>
                        <button></button>
                    </div>

                </li>)}
        </ul>
    )
}