const { Fragment } = React


export function TodoPreview({ todo }) {

    
   const todosList = todo.todosList.slice(0, 3)

    return (
        <Fragment>
            <p className="todo-list-header">{todo.title}</p>
            <ul className="todos-list">
                {todosList.map((todoList, idx) =>
                    <li className="todo-list"
                        key={idx}>{todoList}
                    </li>
                )}
            </ul>
        </Fragment>
    )
}