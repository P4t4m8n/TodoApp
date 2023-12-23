import fs from 'fs'
import Cryptr from 'cryptr'

import { backendUtilService } from './backend.util.service.js'
let users = backendUtilService.readJsonFile('data/user.json')
const cryptr = new Cryptr(process.env.SECRET1 || 'secret-puk-1234')

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
  try {
    const json = cryptr.decrypt(loginToken)
    const loggedinUser = JSON.parse(json)
    return loggedinUser
  } catch (err) {
    console.log('Invalid login token')
  }
  return null
}

function checkLogin({ username, password }) {
  let user = users.find(user => user.username === username)

  if (user) {
    user = {
      _id: user._id,
      fullname: user.fullname,
      isAdmin: user.isAdmin,
    }
  }

  return Promise.resolve(user)
}

function save(user) {
  users.push(user)
  return _saveUsersToFile().then(() => user)
}

function signup({ fullname, username, password }) {
  let user = {
    _id: _makeId(),
    fullname,
    username,
    password,
  }

  users.push(user)

  return _saveUsersToFile().then(() => {
    user = { ...user }
    delete user.password
    return user
  })
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