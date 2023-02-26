require('module-alias/register')
const debug = require('debug')('app:server|post|createPost')
const conn = require('@src/dbconnection')
const PROTO_PATH = './protos/post.proto'

const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')

const addr = `127.0.0.1:${process.env.SERVER_UPDATE_POST_PORT}`

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true
})

const proto = grpc.loadPackageDefinition(packageDefinition)

const postInteractor = require('@srcInteractors/postInteractor')

const userService = {
    getPostById: async (call, callback) => {
        postInteractor.getPostById(call.request)
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
    updatePost: async (call, callback) => {
        postInteractor.updatePost(call.request)
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

    server.addService(proto.PostService.service, userService)
    server.bindAsync(addr, creds, (err, _) => {
        if (err) {
            return cleanup(server)
        }

        server.start()
    })

    debug(`Listening on ${addr}`)
}

main()