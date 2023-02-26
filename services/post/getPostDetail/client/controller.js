const debug = require('debug')('app:client|post|getPostById')
const responseHandler = require('@utils/responseHandler')
const catchAsync = require('@utils/catchAsync')
const constants = require('@utils/constants')
const AppError = require('@utils/appError')

module.exports = (client) => catchAsync(async (req, res, next) => {

    let { post, user } = await client().getPostDetail({id: req.params.id})
    if (!post) {
        return new(new AppError('Data not found', 400, constants.STATUS_CODE.VALIDATION_ERROR))
    }

    if (!post.caption) {
        post.caption = null
    }

    if (!post.tags) {
        post.tags = null
    }

    if (!user.photo) {
        user.photo = null
    }

    res.status(200).json(responseHandler(
        {
            id: post.id, image: post.image, caption: post.caption, tags: post.tags, likes: post.likes,
            createdAt: post.createdAt, updatedAt: post.updatedAt,
            user: {
                name: user.name,
                username: user.username,
                email: user.email,
                photo: user.photo
            }
        },
        constants.STATUS_CODE.SUCCESS,
        'Successfully Get Post'
    ))
})