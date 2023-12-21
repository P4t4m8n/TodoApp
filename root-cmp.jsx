const Router = ReactRouterDOM.HashRouter
const { Route, Routes } = ReactRouterDOM

import { Home } from './pages/Home.jsx'
import { TodoIndex } from './pages/TodoIndex.jsx'
import { TodoDetails } from './pages/TodoDetails.jsx'
import { AppHeader } from './cmp/AppHeader.jsx'
import { TodoEdit } from './cmp/TodoEdit.jsx'

export function App() {
    return (
        <Router>
            <div className='main-layout'>
                <AppHeader />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/todo" element={<TodoIndex />} />
                    <Route path="/todo/:todoId" element={<TodoDetails />} />
                    <Route path="/todo/edit/:todoId" element={<TodoEdit />} />
                    <Route path="/todo/edit" element={<TodoEdit />} />
                </Routes>
            </div>
        </Router>
    )
}