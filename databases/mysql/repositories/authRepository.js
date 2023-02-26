const createUser = require('./../usecases/auth/createUser')
const getUserByUsernameOrEmail = require('./../usecases/auth/getUserByUsernameOrEmail')

exports.createUser = async (body) => createUser(body)
exports.getUserByUsernameOrEmail = async (body) => getUserByUsernameOrEmail(body)