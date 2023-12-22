import { storageService } from './async-storage.service.js'

export const userService = {
    login,
    signup,
    logout,
    getLoggedinUser,
    getEmptyCredentials,
    addActivity,
    update,
    getActivityTimes,
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

function signup(credentials) {
    return _saveUser(credentials)
    // const user = { ...credentials }
    // return storageService.post(KEY, user)
    //     .then(_setLoggedinUser)
}

function update(user) {
    return _saveUser(user)
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

function getActivityTimes(activites) {
    const currentDate = new Date()
    return activites.map(activity => {
        let pastDate = new Date(activity.at)
        let timeDifference = currentDate - pastDate
        let timeStr = ''
        let seconds = Math.floor(timeDifference / 1000)
        let minutes = Math.floor(seconds / 60);
        let hours = Math.floor(minutes / 60);
        let days = Math.floor(hours / 24);

        if (days) timeStr = days + ' Days ago'
        else if (hours) {
            if (hours > 2) timeStr = hours + ' Hours ago'
            else
                timeStr = 'Couple of hours'
        }
        else if (minutes) timeStr = minutes + ' Minutes ago'
        else timeStr = seconds + ' Seconds ago'

        return { txt: activity.txt, timeStr }
    })
}

function _saveUser(user) {
    const tempUser = { ...user }
    const method = tempUser._id ? 'put' : 'post'
    return storageService[method](KEY, user)
        .then(_setLoggedinUser)
}
