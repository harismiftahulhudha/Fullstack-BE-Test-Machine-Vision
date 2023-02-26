const likeRepository = require('./../mysql/repositories/likeRepository')

exports.likePost = async (body) => likeRepository.likePost(body)
exports.unlikePost = async (body) => likeRepository.unlikePost(body)