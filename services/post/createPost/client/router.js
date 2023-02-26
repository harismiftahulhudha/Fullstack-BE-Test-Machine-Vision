const controller = require('./controller')
const middlewareAuth = require('@frameworks/express/middleware/middlewareAuth')

module.exports = (client, router) => {

    router.post('/', middlewareAuth, controller.uploadImage, controller.resizeImage, controller.createPost(client))

    return router
}