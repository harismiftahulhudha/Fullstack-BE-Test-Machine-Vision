const controller = require('./controller')

module.exports = (client, router) => {

    router.post('/login', controller(client))

    return router
}