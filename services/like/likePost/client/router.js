const controller = require('./controller')
const middlewareAuth = require('@frameworks/express/middleware/middlewareAuth')

module.exports = (client, router) => {

    router.put('/like/:id', middlewareAuth, controller(client))

    return router
}