const {promisify} = require('util')
const catchAsync = require('@utils/catchAsync')
const AppError = require('@utils/appError')
const jwt = require('jsonwebtoken')

module.exports = catchAsync(async (req, res, next) => {
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
        return next(new AppError('No auth token', 401))
    }

    try {
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY)

        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            username: decoded.username,
        }

        next()
    } catch (e) {
        return next(new AppError(e.message, 401))
    }
})