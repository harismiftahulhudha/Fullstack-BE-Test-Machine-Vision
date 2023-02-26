require('module-alias/register')
const {errorHandler, start, express, app} = require('@frameworks/express')
const client = require("./client")
const routerExpress = express.Router()
const router = require('./router')(client, routerExpress)
app.use(`/user`, router)

errorHandler()

start(process.env.CLIENT_GET_USER_PORT)