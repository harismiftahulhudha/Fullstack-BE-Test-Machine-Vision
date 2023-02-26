const controller = require('./controller')
const middlewareAuth = require('@frameworks/express/middleware/middlewareAuth')

module.exports = (client, router) => {

    router.get('/:id', middlewareAuth, controller(client))

    return router
}