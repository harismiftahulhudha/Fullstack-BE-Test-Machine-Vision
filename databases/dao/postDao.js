const postRepository = require('./../mysql/repositories/postRepository')

exports.createPost = async (body) => postRepository.createPost(body)
exports.updatePost = async (body) => postRepository.updatePost(body)
exports.getPostById = async (body) => postRepository.getPostById(body)
exports.deletePost = async (body) => postRepository.deletePost(body)
exports.getPostDetail = async (body) => postRepository.getPostDetail(body)
exports.getListPost = async (body) => postRepository.getListPost(body)