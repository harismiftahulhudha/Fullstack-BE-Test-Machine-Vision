const controller = require('./controller')


module.exports = (client, router) => {

    router.post('/register', controller.uploadPhoto, controller.resizePhoto, controller.register(client))

    return router
}