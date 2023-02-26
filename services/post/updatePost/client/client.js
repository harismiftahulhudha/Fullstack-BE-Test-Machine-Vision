const PROTO_PATH = './protos/post.proto'

const grpc = require("@grpc/grpc-js")
const protoLoader = require("@grpc/proto-loader")

module.exports = () => {
    const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
        keepCase: true,
        longs: String,
        enums: String,
        arrays: true
    })

    const PostService = grpc.loadPackageDefinition(packageDefinition).PostService
    const client = new PostService(
        `127.0.0.1:${process.env.SERVER_UPDATE_POST_PORT}`,
        grpc.credentials.createInsecure()
    )
    const getPostById = (body) => {
        return new Promise((resolve, reject) => client.getPostById(body, (err, data) => {
            if (err) {
                return reject(err)
            }
            return resolve(Object.keys(data).length === 0 ? null : data)
        }))
    }
    const updatePost = (body) => {
        return new Promise((resolve, reject) => client.updatePost(body, (err, data) => {
            if (err) {
                return reject(err)
            }
            return resolve(Object.keys(data).length === 0 ? null : data)
        }))
    }

    return {
        client,
        getPostById,
        updatePost
    }
}