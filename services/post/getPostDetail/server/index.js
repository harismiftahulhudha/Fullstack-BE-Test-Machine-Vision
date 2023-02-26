require('module-alias/register')
const debug = require('debug')('app:server|post|getPostDetail')
const conn = require('@src/dbconnection')
const PROTO_PATH = './protos/post.proto'

const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')

const addr = `127.0.0.1:${process.env.SERVER_GET_POST_DETAIL_PORT}`

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true
})

const proto = grpc.loadPackageDefinition(packageDefinition)

const postInteractor = require('@srcInteractors/postInteractor')

const userService = {
    getPostDetail: async (call, callback) => {
        postInteractor.getPostDetail(call.request)
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