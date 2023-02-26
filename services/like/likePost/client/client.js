const PROTO_PATH = './protos/like.proto'

const grpc = require("@grpc/grpc-js")
const protoLoader = require("@grpc/proto-loader")

module.exports = () => {
    const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
        keepCase: true,
        longs: String,
        enums: String,
        arrays: true
    })

    const LikeService = grpc.loadPackageDefinition(packageDefinition).LikeService
    const client = new LikeService(
        `127.0.0.1:${process.env.SERVER_LIKE_POST_PORT}`,
        grpc.credentials.createInsecure()
    )
    const likePost = (body) => {
        return new Promise((resolve, reject) => client.likePost(body, (err, data) => {
            if (err) {
                return reject(err)
            }
            return resolve(Object.keys(data).length === 0 ? null : data)
        }))
    }

    return {
        client,
        likePost
    }
}