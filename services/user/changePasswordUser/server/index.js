require('module-alias/register')
const debug = require('debug')('app:server|user|changePasswordUser')
const conn = require('@src/dbconnection')
const PROTO_PATH = './protos/user.proto'

const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')

const addr = `127.0.0.1:${process.env.SERVER_CHANGE_PASSWORD_USER_PORT}`

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true
})

const proto = grpc.loadPackageDefinition(packageDefinition)

const userInteractor = require('@srcInteractors/userInteractor')

const userService = {
    getUserById: async (call, callback) => {
        userInteractor.getUserById(call.request)
            .then(res => {
                if (!res) {
                    callback(null, {})
                } else {
                    callback(null, res)
                }
            })
            .catch(err => {
                callback(err)
            })
    },
    changePasswordUser: async (call, callback) => {
        userInteractor.changePasswordUser(call.request)
            .then(res => {
                if (!res) {
                    callback(null, {})
                } else {
                    callback(null, res)
                }
            })
            .catch(err => {
                callback(err)
            })
    },
}

function cleanup(server) {
    debug('Cleanup')

    if (server) {
        conn.mysqlDisconnect()
        server.forceShutdown()
    }
}

function main() {
    const server = new grpc.Server()
    const creds = grpc.ServerCredentials.createInsecure()

    conn.mysqlConnect()
    process.on('SIGINT', () => {
        debug('\nCaught interrupt signal')
        cleanup(server)
    })

    server.addService(proto.UserService.service, userService)
    server.bindAsync(addr, creds, (err, _) => {
        if (err) {
            return cleanup(server)
        }

        server.start()
    })

    debug(`Listening on ${addr}`)
}

main()