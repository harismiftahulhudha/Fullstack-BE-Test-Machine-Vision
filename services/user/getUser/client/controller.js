const debug = require('debug')('app:client|user|getUser')
const responseHandler = require('@utils/responseHandler')
const catchAsync = require('@utils/catchAsync')
const constants = require('@utils/constants')
const AppError = require('@utils/appError')

module.exports = (client) => catchAsync(async (req, res, next) => {
    const result = await client().getUserById({
        userId: req.user.userId
    })
    if (!result) {
        return next(new AppError('Data not found', 400, constants.STATUS_CODE.VALIDATION_ERROR))
    }
    if (!result.photo) {
        result.photo = null
    }

    res.status(200).json(responseHandler(
        {
            name: result.name,
            username: result.username,
            email: result.email,
            photo: result.photo,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,
        },
        constants.STATUS_CODE.SUCCESS,
        'Successfully Get User'
    ))
})