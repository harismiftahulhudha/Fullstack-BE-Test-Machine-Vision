const PROTO_PATH = './protos/user.proto'

const grpc = require("@grpc/grpc-js")
const protoLoader = require("@grpc/proto-loader")

module.exports = () => {
    const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
        keepCase: true,
        longs: String,
        enums: String,
        arrays: true
    })

    const UserService = grpc.loadPackageDefinition(packageDefinition).UserService
    const client = new UserService(
        `127.0.0.1:${process.env.SERVER_CHANGE_PASSWORD_USER_PORT}`,
        grpc.credentials.createInsecure()
    )

    const getUserById = (body) => {
        return new Promise((resolve, reject) => client.getUserById(body, (err, data) => {
            if (err) {
                return reject(err)
            }
            return resolve(Object.keys(data).length === 0 ? null : data)
        }))
    }
    const changePasswordUser = (body) => {
        return new Promise((resolve, reject) => client.changePasswordUser(body, (err, data) => {
            if (err) {
                return reject(err)
            }
            return resolve(Object.keys(data).length === 0 ? null : data)
        }))
    }

    return {
        client,
        getUserById,
        changePasswordUser
    }
}