const { Post } = require('./../../models')
const moment = require("moment/moment")

module.exports = async (body) => {
    let post = await Post.findByPk(body.id, {
        include: 'User'
    })
    if (!post) {
        throw new Error('Data not found')
    }
    if (post) {
        post = JSON.parse(JSON.stringify(post))
        post.createdAt = moment(post.createdAt).utc().format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]")
        post.updatedAt = moment(post.updatedAt).utc().format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]")
        post.User.createdAt = moment(post.User.createdAt).utc().format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]")
        post.User.updatedAt = moment(post.User.updatedAt).utc().format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]")
    }
    let user = post.User
    return {
        post, user
    }
}