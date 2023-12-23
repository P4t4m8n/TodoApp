import axios from 'axios'
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
    remove,
}


const STORAGE_KEY = 'loggedInUser'

function getLoggedinUser() {
    const entity = sessionStorage.getItem(STORAGE_KEY)
    return JSON.parse(entity)
}

function login({ username, password }) {
    return axios
        .post('api/login', { username, password })
        .then(res => res.data)
        .then(user => {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
            return user
            // const user = users.find(user => user.username === username && user.password === password)
            // if (user) return _setLoggedinUser(user)
            // else return Promise.reject('Invalid login')
        })
}

function signup(credentials) {
    return axios
        .post('/api/signup', credentials)
        .then(res => res.data)
        .then(user => {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
            return user
        })
}

function update(credentials) {
    return axios
        .put('/api/user/' + credentials._id, credentials)
        .then(res => res.data)
        .then(user => {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
            return user
        })
}

function logout() {
    sessionStorage.removeItem(STORAGE_KEY)
    return axios.post('api/logout')
}

function remove(userId) {
    console.log(userId)
    return axios.delete('/api/user/' + userId)
}

// function _setLoggedinUser(user) {
//     const userToSave = {
//         _id: user._id, username: user.username,
//         password: user.password, fullname: user.fullname,
//         activites: user.activites, todosComplete: user.todosComplete,
//     }
//     sessionStorage.setItem(STORAGE_KEY, JSON.stringify(userToSave))
//     return userToSave
// }

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
    return axios.put('/api/user/' + user._id, user)
        .then(res => res.data)
        .then(user => {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
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

function getById(userId) {
    return axios
        .get('/api/user/' + userId)
        .then(res => res.data)
        .catch(err => console.log(err))
}


