require('module-alias/register')
const debug = require('debug')('app:express')
const express = require('express')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')
const cors = require('cors')
const AppError = require('@utils/appError')
const globalErrorHandler = require('@utils/errorHandler')
const { createProxyMiddleware } = require("http-proxy-middleware")

const app = express()

// Set Securty HTTP headers
app.use(helmet())
// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// Limit requests from same API
const limiter = rateLimit({
    max: 1000,
    windowMs: 15 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in 15 minutes!',
    handler: function (req, res, next, options) {
        next(new AppError('Too many requests from this IP, please try again in 15 minutes!', 429))
    }
})
app.use('/api', limiter)

// Cors
app.use(cors())

// Body parser, reading from body into req.body
// app.use(express.json({ limit: '10kb' }))
// app.use(express.urlencoded({ extended: false }))

// Data sanitization against NoSQL query injection
app.use(mongoSanitize())

// Data sanitization against XSS
app.use(xss())

// Prevent parameter pollution
app.use(hpp({
    whitelist: [
        'duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'difficulty', 'price'
    ]
}))

process.on("uncaughtException", err => {
    debug('UNCAUGHT EXCEPTION! Shutting down...')
    debug(err.name, err.message)
    process.exit(1)
})

process.on('unhandledRejection', err => {
    debug(err.name, err.message)
    debug('UNHANDLER REJECTION! Shutting down...')
    server.close(() => {
        process.exit(1)
    })
})

// Proxy Servers
app.use('/auth/register', createProxyMiddleware({
    target: `http://127.0.0.1:${process.env.CLIENT_REGISTER_PORT}/auth/register`,
    changeOrigin: true,
    pathRewrite: {
        "^/auth/register": "/",
    },
    onError: globalErrorHandler
}))
app.use('/auth/login', createProxyMiddleware({
    target: `http://127.0.0.1:${process.env.CLIENT_LOGIN_PORT}/auth/login`,
    changeOrigin: true,
    pathRewrite: {
        "^/auth/login": "/",
    },
    onError: globalErrorHandler
}))
app.use('/auth/logout', createProxyMiddleware({
    target: `http://127.0.0.1:${process.env.CLIENT_LOGOUT_PORT}/auth/logout`,
    changeOrigin: true,
    pathRewrite: {
        "^/auth/logout": "/",
    },
    onError: globalErrorHandler
}))
app.get('/user', createProxyMiddleware({
    target: `http://127.0.0.1:${process.env.CLIENT_GET_USER_PORT}/user`,
    changeOrigin: true,
    pathRewrite: {
        "^/user": "/",
    },
    onError: globalErrorHandler
}))
app.put('/user', createProxyMiddleware({
    target: `http://127.0.0.1:${process.env.CLIENT_UPDATE_USER_PORT}/user`,
    changeOrigin: true,
    pathRewrite: {
        "^/user": "/",
    },
    onError: globalErrorHandler
}))
app.use('/user/change-password', createProxyMiddleware({
    target: `http://127.0.0.1:${process.env.CLIENT_CHANGE_PASSWORD_USER_PORT}/user/change-password`,
    changeOrigin: true,
    pathRewrite: {
        "^/user/change-password": "/",
    },
    onError: globalErrorHandler
}))
app.get('/post', createProxyMiddleware({
    target: `http://127.0.0.1:${process.env.CLIENT_GET_LIST_POST_PORT}/post`,
    changeOrigin: true,
    pathRewrite: {
        "^/post": "/",
    },
    onError: globalErrorHandler
}))
app.post('/post', createProxyMiddleware({
    target: `http://127.0.0.1:${process.env.CLIENT_CREATE_POST_PORT}/post`,
    changeOrigin: true,
    pathRewrite: {
        "^/post": "/",
    },
    onError: globalErrorHandler
}))
app.get('/post/:id', createProxyMiddleware({
    target: `http://127.0.0.1:${process.env.CLIENT_GET_POST_DETAIL_PORT}/post`,
    changeOrigin: true,
    pathRewrite: {
        "^/post": "/",
    },
    onError: globalErrorHandler
}))
app.put('/post/:id', createProxyMiddleware({
    target: `http://127.0.0.1:${process.env.CLIENT_UPDATE_POST_PORT}/post`,
    changeOrigin: true,
    pathRewrite: {
        "^/post": "/",
    },
    onError: globalErrorHandler
}))
app.delete('/post/:id', createProxyMiddleware({
    target: `http://127.0.0.1:${process.env.CLIENT_DELETE_POST_PORT}/post`,
    changeOrigin: true,
    pathRewrite: {
        "^/post": "/",
    },
    onError: globalErrorHandler
}))
app.put('/post/like/:id', createProxyMiddleware({
    target: `http://127.0.0.1:${process.env.CLIENT_LIKE_POST_PORT}/post/like`,
    changeOrigin: true,
    pathRewrite: {
        "^/post/like": "/",
    },
    onError: globalErrorHandler
}))
app.put('/post/unlike/:id', createProxyMiddleware({
    target: `http://127.0.0.1:${process.env.CLIENT_UNLIKE_POST_PORT}/post/unlike`,
    changeOrigin: true,
    pathRewrite: {
        "^/post/unlike": "/",
    },
    onError: globalErrorHandler
}))
app.get('/post/user/:id', createProxyMiddleware({
    target: `http://127.0.0.1:${process.env.CLIENT_GET_LIST_POST_BY_USER_ID_PORT}/post/user`,
    changeOrigin: true,
    pathRewrite: {
        "^/post/user": "/",
    },
    onError: globalErrorHandler
}))

app.all('*', (req, res, next) => {
    // const err = new Error(`Can't find ${req.originalUrl} on this server!`)
    // err.status = 'fail'
    // err.statusCode = 404

    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

app.use(globalErrorHandler)

const http = require('http')
const server = http.createServer(app)

const port = process.env.PROXY_PORT || 3000
server.listen(port, () => {
    debug(`Listening on 127.0.0.1:${port}`)
})