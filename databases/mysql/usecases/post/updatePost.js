const { Post, User } = require('./../../models')
const moment = require("moment/moment")

module.exports = async (body) => {
    let user = await User.findByPk(body.userId, {})
    if (!user) {
        throw new Error('Data not found')
    }

    await Post.update({
        image: body.image,
        caption: body.caption,
        tags: body.tags
    }, {
        where: { id: body.id, userId: body.userId }
    })
    let post = await Post.findByPk(body.id, {
        include: 'User'
    })
    if (post) {
        post = JSON.parse(JSON.stringify(post))
        post.createdAt = moment(post.createdAt).utc().format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]")
        post.updatedAt = moment(post.updatedAt).utc().format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]")
        post.User.createdAt = moment(post.User.createdAt).utc().format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]")
        post.User.updatedAt = moment(post.User.updatedAt).utc().format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]")
    }
    user = post.User
    return {
        post, user
    }
}