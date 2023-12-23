
const { NavLink } = ReactRouterDOM

export function TodoSideBar() {


    return (
        <section className="side-bar">
            <div className="side-bar-header">
                <button className="side-bar-menu">menu</button>
            </div>
            <div className="side-bar-container">
                <nav className="side-bar-nav">
                    <NavLink to="/todo/myday" >May Day</NavLink>
                    <NavLink to="/todo/importent" >Importent</NavLink>
                    <NavLink to="/todo/planned" >Planned</NavLink>
                    <NavLink to="/todo/assigned_to_me" >Assigned to me</NavLink>
                    <NavLink to="/todo/tasks" >Todos</NavLink>
                </nav>
            </div>
        </section>
    )
}