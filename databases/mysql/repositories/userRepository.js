const getUserById = require('./../usecases/user/getUserById')
const updateUser = require('./../usecases/user/updateUser')
const changePasswordUser = require('./../usecases/user/changePasswordUser')

exports.getUserById = async (body) => getUserById(body)
exports.updateUser = async (body) => updateUser(body)
exports.changePasswordUser = async (body) => changePasswordUser(body)