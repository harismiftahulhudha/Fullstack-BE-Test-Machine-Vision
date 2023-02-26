const authDao = require('@databasesDao/authDao')

module.exports.createUser = async (body) => {
    return authDao.createUser(body)
}

module.exports.getUserByUsernameOrEmail = async (body) => {
    return authDao.getUserByUsernameOrEmail(body)
}