const likeDao = require('@databasesDao/likeDao')

module.exports.likePost = async (body) => {
    return likeDao.likePost(body)
}

module.exports.unlikePost = async (body) => {
    return likeDao.unlikePost(body)
}