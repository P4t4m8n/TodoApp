const Router = ReactRouterDOM.BrowserRouter
const { Route, Routes } = ReactRouterDOM
const { Provider } = ReactRedux

import { Home } from './pages/Home.jsx'
import { TodoIndex } from './pages/TodoIndex.jsx'
import { TodoDetails } from './pages/TodoDetails.jsx'
import { AppHeader } from './cmp/AppHeader.jsx'
import { TodoEdit } from './cmp/TodoEdit.jsx'
import { TodoSideBar } from './pages/TodoSideBar.jsx'
import { store } from './store/store.js'
import { UserProfile } from './pages/UserProfile.jsx'

export function App() {

    return (
        <Provider store={store}>
            <Router>
                <div className='main-layout'>
                    <AppHeader />
                    <main className='main-page'>
                        <TodoSideBar></TodoSideBar>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/todo/:userId" element={<TodoIndex />} />
                            <Route path="/todo/:userId/:todoId" element={<TodoDetails />} />
                            <Route path="/todo/:userId/edit/:todoId" element={<TodoEdit />} />
                            <Route path="/todo/:userId/edit" element={<TodoEdit />} />
                            <Route path="/user/:userId" element={<UserProfile />} />

                        </Routes>
                    </main>
                </div>
            </Router>
        </Provider>
    )
}