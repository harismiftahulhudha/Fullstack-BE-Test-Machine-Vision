const debug = require('debug')('app:database-mysql')
const { db } = require('./models')

module.exports.connect = async () => {
    try {
        await db.authenticate()
        debug('Connection to Mysql is successful')
    } catch (err) {
        debug('Connection to Mysql is error:')
        debug(err)
    }
}

module.exports.disconnect = async () => {
    try {
        await db.close()
        debug('Connection to mysql was successfully lost')
    } catch (err) {
        debug('Connection to mysql failed to break:')
        debug(err)
    }
}