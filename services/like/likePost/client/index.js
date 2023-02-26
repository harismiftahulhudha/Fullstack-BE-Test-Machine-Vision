require('module-alias/register')
const {errorHandler, start, express, app} = require('@frameworks/express')
const client = require("./client")
const routerExpress = express.Router()
const router = require('./router')(client, routerExpress)

app.use(`/post`, router)

errorHandler()

start(process.env.CLIENT_LIKE_POST_PORT)