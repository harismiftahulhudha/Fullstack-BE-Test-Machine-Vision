const { User } = require('./../../models')
const { Op } = require("sequelize")
const moment = require("moment/moment")
const SHA256 = require("crypto-js/sha256")

module.exports = async (body) => {
    let password = SHA256(body.password).toString()
    let user = await User.findAll({
        where: {
            [Op.or]: [
                { username: body.username.toLowerCase(), password: password },
                { email: body.username.toLowerCase(), password: password },
            ]
        },
    })
    if (user && user.length > 0) {
        user = user[0]
        user = JSON.parse(JSON.stringify(user))
        user.createdAt = moment(user.createdAt).utc().format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]")
        user.updatedAt = moment(user.updatedAt).utc().format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]")
    } else {
        user = null
    }
    return user
}