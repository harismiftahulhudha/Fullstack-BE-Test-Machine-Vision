const { User } = require('./../../models')
const moment = require("moment/moment")

module.exports = async (body) => {
    let user = await User.findByPk(body.userId, {})
    if (!user) {
        throw new Error('Data not found')
    }
    body.email = body.email.toLowerCase()
    body.username = body.username.toLowerCase()
    if (!(user.email === body.email && user.username === body.username)) {
        let newUser = await User.findOne({where: {username: body.username}})
        if (newUser && newUser.id !== user.id) {
            throw new Error('Duplicate Username')
        }
        newUser = await User.findOne({where: {email: body.email}})
        if (newUser && newUser.id !== user.id) {
            throw new Error('Duplicate Email')
        }
    }

    user = await User.update({
        name: body.name,
        username: body.username,
        email: body.email,
        photo: body.photo,
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