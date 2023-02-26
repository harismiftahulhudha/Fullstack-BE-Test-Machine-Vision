const userRepository = require('./../mysql/repositories/userRepository')

exports.getUserById = async (body) => userRepository.getUserById(body)
exports.updateUser = async (body) => userRepository.updateUser(body)
exports.changePasswordUser = async (body) => userRepository.changePasswordUser(body)