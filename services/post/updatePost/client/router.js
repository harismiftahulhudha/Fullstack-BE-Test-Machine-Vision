const controller = require('./controller')
const middlewareAuth = require('@frameworks/express/middleware/middlewareAuth')

module.exports = (client, router) => {

    router.put('/:id', middlewareAuth, controller.uploadImage, controller.resizeImage, controller.updatePost(client))

    return router
}