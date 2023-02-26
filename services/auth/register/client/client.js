const PROTO_PATH = './protos/auth.proto'

const grpc = require("@grpc/grpc-js")
const protoLoader = require("@grpc/proto-loader")

module.exports = () => {
    const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
        keepCase: true,
        longs: String,
        enums: String,
        arrays: true
    })

    const AuthService = grpc.loadPackageDefinition(packageDefinition).AuthService
    const client = new AuthService(
        `127.0.0.1:${process.env.SERVER_REGISTER_PORT}`,
        grpc.credentials.createInsecure()
    )

    const createUser = (body) => {
        return new Promise((resolve, reject) => client.createUser(body, (err, data) => {
            if (err) {
                return reject(err)
            }
            return resolve(Object.keys(data).length === 0 ? null : data)
        }))
    }

    return {
        client,
        createUser
    }
}