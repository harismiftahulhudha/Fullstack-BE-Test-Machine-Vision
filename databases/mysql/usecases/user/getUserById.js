const { User } = require('./../../models')
const moment = require("moment/moment")

module.exports = async (body) => {
    let user = await User.findByPk(body.userId, {})
    if (user) {
        user = JSON.parse(JSON.stringify(user))
        user.createdAt = moment(user.createdAt).utc().format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]")
        user.updatedAt = moment(user.updatedAt).utc().format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]")
    } else {
        user = null
    }
    return user
}