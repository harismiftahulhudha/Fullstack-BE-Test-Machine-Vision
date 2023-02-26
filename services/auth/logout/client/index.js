require('module-alias/register')
const {errorHandler, start, express, app} = require('@frameworks/express')
const routerExpress = express.Router()
const router = require('./router')(routerExpress)
app.use(`/auth`, router)

errorHandler()

start(process.env.CLIENT_LOGOUT_PORT)