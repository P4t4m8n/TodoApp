import { userService } from "../services/user.service.js"
import { SET_USER } from "../store/store.js"
import { TodoLogin } from "./TodoLogin.jsx"

const { Link, NavLink } = ReactRouterDOM
const { useState } = React
const { useNavigate } = ReactRouter
const { useSelector, useDispatch } = ReactRedux


export function AppHeader() {

    const user = useSelector(storeState => storeState.userObj)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    function onLogout() {
        // userService.addActivity('Logged out')
        //     .then(() =>
        userService.logout()
            .then(() => {
                navigate('/')
                onSetUser(null)
            })
            .catch((err) => {
            })
    }

    function onSetUser(user) {
        dispatch({ type: SET_USER, user })
        userService.addActivity('Logged in')
        navigate('/')
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
                    <TodoLogin onSetUser={onSetUser}></TodoLogin>
                </section>
            )}
        </section>
    )
}