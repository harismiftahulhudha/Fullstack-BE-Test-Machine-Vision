const { User } = require('./../../models')
const moment = require("moment/moment")
const SHA256 = require("crypto-js/sha256")

module.exports = async (body) => {
    let user = await User.findByPk(body.userId, {})
    if (!user) {
        throw new Error('Data not found')
    }
    body.oldPassword = SHA256(body.oldPassword).toString()
    body.newPassword = SHA256(body.newPassword).toString()
    body.confirmNewPassword = SHA256(body.confirmNewPassword).toString()

    if (user.password !== body.oldPassword) {
        throw new Error('Password not found')
    }

    if (body.newPassword !== body.confirmNewPassword) {
        throw new Error('Password not match')
    }

    user = await User.update({
        password: body.newPassword,
    }, {
        where: { id: body.userId }
    })
    user = await User.findByPk(body.userId, {})
    if (user) {
        user = JSON.parse(JSON.stringify(user))
        user.createdAt = moment(user.createdAt).utc().format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]")
        user.updatedAt = moment(user.updatedAt).utc().format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]")
    }
    return user
}