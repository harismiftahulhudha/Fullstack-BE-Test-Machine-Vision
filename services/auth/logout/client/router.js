const controller = require('./controller')
const middlewareAuth = require('@frameworks/express/middleware/middlewareAuth')

module.exports = (router) => {

    router.post('/logout', middlewareAuth, controller())

    return router
}