const { Post, User, UserLiked } = require('./../../models')

module.exports = async (body) => {
    let total = await UserLiked.count({where: {userId: body.userId, postId: body.postId}})
    if (total > 0) {
        throw new Error('Post already Liked')
    }
    let user = await User.findByPk(body.userId, {})
    if (!user) {
        throw new Error('Data not found')
    }
    let post = await Post.findByPk(body.postId, {})
    if (!post) {
        throw new Error('Data not found')
    }

    await UserLiked.create(body)
    const totalLike = await UserLiked.count({where: {postId: body.postId}})
    await Post.update({
        likes: totalLike
    }, {
        where: { id: body.postId }
    })

    return null
}