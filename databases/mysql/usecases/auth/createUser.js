const { User } = require('./../../models')
const moment = require("moment/moment")
const SHA256 = require("crypto-js/sha256")

module.exports = async (body) => {
    let user = await User.findOne({
        where: { email: body.email.toLowerCase() }
    })
    if (user) {
        throw new Error('Duplicate Email')
    }
    user = await User.findOne({
        where: { username: body.username.toLowerCase() }
    })
    if (user) {
        throw new Error('Duplicate Username')
    }
    body.password = SHA256(body.password).toString()
    body.username = body.username.toLowerCase()
    body.email = body.email.toLowerCase()
    user = await User.create(body)
    if (user) {
        user = JSON.parse(JSON.stringify(user))
        user.createdAt = moment(user.createdAt).utc().format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]")
        user.updatedAt = moment(user.updatedAt).utc().format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]")
    }
    return user
}