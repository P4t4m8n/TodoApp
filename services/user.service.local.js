import { storageService } from './async-storage.service.js'

export const userService = {
    login,
    signup,
    logout,
    getLoggedinUser,
    getEmptyCredentials,
    addActivity,
}


const KEY = 'userDB'
const STORAGE_KEY_LOGGEDIN_USER = 'loggedInUser'

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

function login({ username, password }) {
    return storageService.query(KEY)
        .then(users => {
            const user = users.find(user => user.username === username && user.password === password)
            if (user) return _setLoggedinUser(user)
            else return Promise.reject('Invalid login')
        })
}

function signup({ username, password, fullname, activites, todosComplete }) {
    const user = { username, password, fullname, activites, todosComplete }
    return storageService.post(KEY, user)
        .then(_setLoggedinUser)
}

function logout() {
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
    return Promise.resolve()
}

function _setLoggedinUser(user) {
    const userToSave = {
        _id: user._id, username: user.username,
        password: user.password, fullname: user.fullname,
        activites: user.activites, todosComplete: user.todosComplete,
    }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(userToSave))
    return userToSave
}

function getEmptyCredentials() {
    return {
        username: '',
        password: '',
        fullname: '',
        activites: [],
        todosComplete: 0,
    }
}

function addActivity(txt) {
    var user = userService.getLoggedinUser()
    user.activites.push({ txt, at: Date.now() })
    return storageService.put(KEY, user)
        .then(user => {
            _setLoggedinUser(user)
            return user.activites[user.activites.length - 1]
        })

}

