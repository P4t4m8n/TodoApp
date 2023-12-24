import { logout } from "../store/actions/user.actions.js"
import { TodoLogin } from "./TodoLogin.jsx"

const { Link, NavLink } = ReactRouterDOM
const { useNavigate } = ReactRouter
const { useSelector, useDispatch } = ReactRedux


export function AppHeader() {

    const user = useSelector(storeState => storeState.userMoudle.userObj)
    const navigate = useNavigate()

    function onLogout() {
        logout()
            .then(() => {
                console.log('Logout')
                navigate('/')
            })
            .catch((err) => {
                console.log("err:", err)
            })
    }

    return (
        <section className="header-container">
            <h1>Todo App</h1>

            <nav className="app-nav">
                <NavLink to="/" >Home</NavLink>
                {user && <NavLink to={`todo/${user._id}`} >Todos</NavLink>}
            </nav>

            {user ? (
                <section>
                    <div className="todo-done">{user.todosComplete}</div>
                    <Link to={`user/${user._id}`}>Hello {user.username}</Link>
                    <button onClick={onLogout}>Logout</button>
                </section>
            ) : (
                <section>
                    <TodoLogin ></TodoLogin>
                </section>
            )}
        </section>
    )
}