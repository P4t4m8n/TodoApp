const { NavLink } = ReactRouterDOM


export function AppHeader() {

    return (
        <section className="header-container">
            <h1>Todo App</h1>
            <nav className="app-nav">
                <NavLink to="/" >Home</NavLink>
                <NavLink to="/todo" >Todos</NavLink>
            </nav>
        </section>
    )
}