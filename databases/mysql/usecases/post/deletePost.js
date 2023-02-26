const { Post, User } = require('./../../models')

module.exports = async (body) => {
    let user = await User.findByPk(body.userId, {})
    if (!user) {
        throw new Error('Data not found')
    }
    let post = await Post.findByPk(body.id, {})
    if (!post) {
        throw new Error('Data not found')
    }

    await Post.destroy({
        where: {
            id: body.id
        }
    })

    return null
}