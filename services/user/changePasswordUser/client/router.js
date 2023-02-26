const controller = require('./controller')
const middlewareAuth = require('@frameworks/express/middleware/middlewareAuth')

module.exports = (client, router) => {

    router.put('/change-password', middlewareAuth, controller(client))

    return router
}