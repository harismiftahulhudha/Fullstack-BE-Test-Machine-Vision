const Joi = require("joi")
const debug = require('debug')('app:client|user|changePasswordUser')
const responseHandler = require('@utils/responseHandler')
const catchAsync = require('@utils/catchAsync')
const constants = require('@utils/constants')
const AppError = require('@utils/appError')

module.exports = (client) => catchAsync(async (req, res, next) => {
    const schema = Joi.object({
        oldPassword: Joi.string().min(8).max(255).required(),
        newPassword: Joi.string().min(8).max(255).required(),
        confirmNewPassword: Joi.string().min(8).max(255).required(),
    })

    const {error} = schema.validate(req.body)
    if (error) {
        return next(new AppError(error.message.replace(/"/g, ''), 400, constants.STATUS_CODE.VALIDATION_ERROR))
    }

    const user = await client().getUserById({
        userId: req.user.userId
    })

    if (!user) {
        return next(new AppError('Data not found', 400, constants.STATUS_CODE.VALIDATION_ERROR))
    }

    let request = {
        oldPassword: req.body.oldPassword,
        newPassword: req.body.newPassword,
        confirmNewPassword: req.body.confirmNewPassword,
        userId: req.user.userId,
    }

    const result = await client().changePasswordUser(request)

    res.status(200).json(responseHandler(
        null,
        constants.STATUS_CODE.SUCCESS,
        'Successfully Change Password'
    ))
})