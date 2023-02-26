const debug = require('debug')('app:client|post|getPostById')
const responseHandler = require('@utils/responseHandler')
const catchAsync = require('@utils/catchAsync')
const constants = require('@utils/constants')
const AppError = require('@utils/appError')

module.exports = (client) => catchAsync(async (req, res, next) => {
    if (req.query.search) {
        req.query.where = {
            caption: req.query.search,
            tags: req.query.search,
        }
    }
    req.query.include = 'User'
    let body = {
        query: JSON.stringify(req.query),
        userId: req.user.userId
    }

    let { posts, pagination } = await client().getListPost(body)
    let data = []
    for (let i = 0; i < posts.length; i++) {
        let post = posts[i].post
        if (!post.caption) {
            post.caption = null
        }

        if (!post.tags) {
            post.tags = null
        }
        delete post.userId
        let user = posts[i].user
        if (!user.photo) {
            user.photo = null
        }
        post.user = {
            name: user.name,
            username: user.username,
            email: user.email,
            photo: user.photo,
        }
        data.push(post)
    }

    res.status(200).json(responseHandler(
        { data: data, pagination: pagination },
        constants.STATUS_CODE.SUCCESS,
        'Successfully Get Post'
    ))
})