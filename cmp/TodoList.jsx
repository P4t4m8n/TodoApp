import { TodoPreview } from "./TodoPreview.jsx";
const { Link } = ReactRouterDOM


export function TodoList({ todos, onRemoveTodo }) {


    return (
        <ul className="todos-container">
            {todos.map(todo =>
                <li className="todo" key={todo._id}>
                    <TodoPreview todo={todo}></TodoPreview>
                    <section className="todo-btns">
                        <button onClick={() => onRemoveTodo(todo._id)}>Remove</button>
                        <button><Link to={`/todo/${todo._id}`}>Details</Link></button>
                        <button><Link to={`/todo/edit/${todo._id}`}>Edit</Link></button>
                    </section>
                </li>)}
        </ul>
    )
}