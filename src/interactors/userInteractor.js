const userDao = require('@databasesDao/userDao')

module.exports.getUserById = async (body) => {
    return userDao.getUserById(body)
}

module.exports.updateUser = async (body) => {
    return userDao.updateUser(body)
}

module.exports.changePasswordUser = async (body) => {
    return userDao.changePasswordUser(body)
}