require('module-alias/register')
const debug = require('debug')('app:server|auth|register')
const conn = require('@src/dbconnection')
const PROTO_PATH = './protos/auth.proto'

const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')

const addr = `127.0.0.1:${process.env.SERVER_REGISTER_PORT}`

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true
})

const proto = grpc.loadPackageDefinition(packageDefinition)

const authInteractor = require('@srcInteractors/authInteractor')

const authService = {
    createUser: async (call, callback) => {
        authInteractor.createUser(call.request)
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

    server.addService(proto.AuthService.service, authService)
    server.bindAsync(addr, creds, (err, _) => {
        if (err) {
            return cleanup(server)
        }

        server.start()
    })

    debug(`Listening on ${addr}`)
}

main()