const authRepository = require('./../mysql/repositories/authRepository')

exports.createUser = async (body) => authRepository.createUser(body)
exports.getUserByUsernameOrEmail = async (body) => authRepository.getUserByUsernameOrEmail(body)