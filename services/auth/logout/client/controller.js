const debug = require('debug')('app:client|auth|login')
const responseHandler = require('@utils/responseHandler')
const catchAsync = require('@utils/catchAsync')
const constants = require('@utils/constants')
const AppError = require('@utils/appError')

module.exports = () => catchAsync(async (req, res, next) => {

    return res.status(200).json(responseHandler(
        null,
        constants.STATUS_CODE.SUCCESS,
        'Successfully logged out'
    ))
})