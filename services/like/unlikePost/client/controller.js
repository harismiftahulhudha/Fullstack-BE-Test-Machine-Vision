const debug = require('debug')('app:client|like|unlikePost')
const responseHandler = require('@utils/responseHandler')
const catchAsync = require('@utils/catchAsync')
const constants = require('@utils/constants')

module.exports = (client) => catchAsync(async (req, res, next) => {
    const request = {
        userId: req.user.userId,
        postId: req.params.id
    }

    await client().unlikePost(request)

    res.status(200).json(responseHandler(
        null,
        constants.STATUS_CODE.SUCCESS,
        'Successfully Unliked Post'
    ))
})