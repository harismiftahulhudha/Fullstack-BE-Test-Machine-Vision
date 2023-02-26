const likePost = require('./../usecases/like/likePost')
const unlikePost = require('./../usecases/like/unlikePost')

exports.likePost = async (body) => likePost(body)
exports.unlikePost = async (body) => unlikePost(body)