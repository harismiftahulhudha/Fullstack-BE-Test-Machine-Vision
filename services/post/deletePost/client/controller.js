const debug = require('debug')('app:client|post|deletePost')
const responseHandler = require('@utils/responseHandler')
const catchAsync = require('@utils/catchAsync')
const constants = require('@utils/constants')
const AppError = require('@utils/appError')
const {deleteFile} = require('@utils/fileSystem')

module.exports = (client) => catchAsync(async (req, res, next) => {

    let post = await client().getPostById({id: req.params.id})
    if (!post) {
        return new(new AppError('Data not found', 400, constants.STATUS_CODE.VALIDATION_ERROR))
    }

    if (post.image) {
        const splitExt = post.image.split('.')
        const splitSlash = splitExt[2].split('/machinevision/post/')[1]
        const publicId = `machinevision/post/${splitSlash}`
        await deleteFile(publicId)
    }

    await client().deletePost({
        id: req.params.id,
        userId: req.user.userId
    })


    res.status(200).json(responseHandler(
        null,
        constants.STATUS_CODE.SUCCESS,
        'Successfully Delete Post'
    ))
})