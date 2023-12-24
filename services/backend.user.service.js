import fs from 'fs'
import Cryptr from 'cryptr'

import { backendUtilService } from './backend.util.service.js'

let users = backendUtilService.readJsonFile('data/users.json')

const cryptr = new Cryptr(process.env.SERCRET || 'the-day-9020010')

export const backendUserService = {
  query,
  checkLogin,
  signup,
  remove,
  getById,
  getLoginToken,
  validateToken,
  save
}

function query() {
  return Promise.resolve(users)
}

function getLoginToken(user) {
  return cryptr.encrypt(JSON.stringify(user))
}

function validateToken(loginToken) {
  const json = cryptr.decrypt(loginToken)
  const loggedinUser = JSON.parse(json)
  return loggedinUser
}

function checkLogin({ username, password }) {
  let user = users.find(user => {
    return (user.username === username &&
      user.password === password)
  })
  return Promise.resolve(user)
}

function save(updatedUser) {
  const idx = users.findIndex(user => user._id === updatedUser._id)
  users.splice(idx, 1, updatedUser)
  return _saveUsersToFile().then(() => updatedUser)
}

function signup({ fullname, username, password, activites, todosComplete }) {
  let user = {
    _id: _makeId(),
    fullname,
    username,
    password,
    todosComplete,
    activites
  }

  users.push(user)

  return _saveUsersToFile().then(() => user)
}

function remove(userId) {
  console.log(userId)
  const idx = users.findIndex(user => user._id === userId)

  users.splice(idx, 1)

  return _saveUsersToFile()
}

function getById(userId) {
  const user = users.find(user => user._id === userId)
  return Promise.resolve(user)
}

function _makeId(length = 5) {
  let txt = ''
  let possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return txt
}

function _saveUsersToFile() {
  return new Promise((resolve, reject) => {
    const content = JSON.stringify(users, null, 2)
    fs.writeFile('./data/users.json', content, err => {
      if (err) {
        console.error(err)
        return reject(err)
      }
      resolve()
    })
  })
}