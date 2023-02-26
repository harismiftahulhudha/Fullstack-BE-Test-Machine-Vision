const controller = require('./controller')
const middlewareAuth = require('@frameworks/express/middleware/middlewareAuth')

module.exports = (client, router) => {

    router.put('/', middlewareAuth, controller.uploadPhoto, controller.resizePhoto, controller.updateUser(client))

    return router
}