const { Post, sequelize } = require('./../../models')
const { Op } = require("sequelize")
const moment = require("moment/moment")

module.exports = async (body) => {
    let queryOptions = {}
    let query = JSON.parse(body.query)
    if (query.where) {
        let queryOr = []
        if (query.where.caption) {
            let q = {
                caption: {
                    [Op.like]: `%${query.where.caption}%`
                }
            }
            if (query.where.userId) {
                q.userId = query.where.userId
            }
            queryOr.push(q)
        }
        if (query.where.tags) {
            let q = {
                tags: {
                    [Op.like]: `%${query.where.tags}%`
                }
            }
            if (query.where.userId) {
                q.userId = query.where.userId
            }
            queryOr.push(q)
        }
        if (query.where.caption && query.where.tags) {
            queryOptions.where = {
                [Op.or]: queryOr
            }
        } else {
            if (query.where.userId) {
                queryOptions.where = {
                    userId: query.where.userId
                }
            }
        }
    }

    const totalAllPosts = await Post.count(queryOptions)
    if (query.include) {
        queryOptions.include = query.include
    }
    queryOptions.order = [
        ['createdAt', 'DESC']
    ]
    let limit = 20
    if (query.limit) {
        limit = parseInt(query.limit)
        if (limit < 0) {
            limit = 20
        }
    }
    queryOptions.limit = limit
    let page = 1
    if (query.page) {
        page = parseInt(query.page)
    }
    queryOptions.offset = (page - 1) * limit
    queryOptions.attributes = {
        include: [
            [
                sequelize.literal(`(
                    CASE
                        WHEN (SELECT COUNT(*) FROM UserLiked  as userLike WHERE userLike.postId = Post.id  AND userLike.userId = ${body.userId}) > 0
                            THEN true
                        ELSE false
                    END
                )`), 'isLike'
            ]
        ]
    }
    let posts = await Post.findAll(queryOptions)
    let data = []
    if (posts.length > 0) {
        for (const post of posts) {
            let dataPost = {}
            let newPost = JSON.parse(JSON.stringify(post))
            newPost.createdAt = moment(newPost.createdAt).utc().format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]")
            newPost.updatedAt = moment(newPost.updatedAt).utc().format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]")
            if (queryOptions.include) {
                let include = newPost[queryOptions.include]
                if (include.createdAt) {
                    include.createdAt = moment(include.createdAt).utc().format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]")
                }
                if (include.updatedAt) {
                    include.updatedAt = moment(include.updatedAt).utc().format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]")
                }
                delete newPost['UserId']
                delete newPost[queryOptions.include]
                dataPost[queryOptions.include.toLowerCase()] = JSON.parse(JSON.stringify(include))
            }
            newPost.isLike = parseInt(newPost.isLike)
            dataPost.post = newPost
            data.push(dataPost)
        }
    }
    return {
        posts: data, pagination: {
            totalAll: totalAllPosts,
            total: data.length,
            limit: limit,
            page: page
        }
    }
}