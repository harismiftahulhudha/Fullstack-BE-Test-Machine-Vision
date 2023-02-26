const Joi = require("joi")
const debug = require('debug')('app:client|auth|login')
const jwt = require('jsonwebtoken')
const responseHandler = require('@utils/responseHandler')
const catchAsync = require('@utils/catchAsync')
const constants = require('@utils/constants')
const AppError = require('@utils/appError')

const signToken = (email, username, userId) => {
    return jwt.sign({email, username, userId}, process.env.JWT_SECRET_KEY, { expiresIn: '15m' })
}

module.exports = (client) => catchAsync(async (req, res, next) => {
    const schema = Joi.object({
        username: Joi.string().min(3).max(255).required(),
        password: Joi.string().min(8).max(255).required(),
    })

    const {error} = schema.validate(req.body)
    if (error) {
        return next(new AppError(error.message.replace(/"/g, ''), 400, constants.STATUS_CODE.VALIDATION_ERROR))
    }

    let request = {
        username: req.body.username,
        password: req.body.password
    }

    const result = await client().getUserByUsernameOrEmail(request)
    if (!result) {
        return next(new AppError('Username not found or Invalid password', 400, constants.STATUS_CODE.VALIDATION_ERROR))
    }

    const token = signToken(result.email, result.username, result.id)

    return res.status(200).json(responseHandler(
        { token },
        constants.STATUS_CODE.SUCCESS,
        'Successfully logged in'
    ))
})