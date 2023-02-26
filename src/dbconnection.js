const mysqlConn = require('./../databases/mysql/connection')

module.exports.mysqlConnect = async () => {
    await mysqlConn.connect()
}

module.exports.mysqlDisconnect = async () => {
    await mysqlConn.disconnect()
}