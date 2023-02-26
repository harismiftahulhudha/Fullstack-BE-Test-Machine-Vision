const postDao = require('@databasesDao/postDao')

module.exports.getPostById = async (body) => {
    return postDao.getPostById(body)
}

module.exports.createPost = async (body) => {
    return postDao.createPost(body)
}

module.exports.updatePost = async (body) => {
    return postDao.updatePost(body)
}

module.exports.deletePost = async (body) => {
    return postDao.deletePost(body)
}

module.exports.getPostDetail = async (body) => {
    return postDao.getPostDetail(body)
}

module.exports.getListPost = async (body) => {
    return postDao.getListPost(body)
}