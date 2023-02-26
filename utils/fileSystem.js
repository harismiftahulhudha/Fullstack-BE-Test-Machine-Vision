const debug = require('debug')('app:fileSystem')
const cloudinary = require("cloudinary").v2
const streamifier = require('streamifier')

exports.uploadFile = async (file, folder, publicId) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary
            .uploader
            .upload_stream(
                {
                    folder: `${folder}/`,
                    public_id: publicId,
                    resource_type: "auto"
                },
                (err, result) => {
                    if (err) {
                        debug('ERROR=============================')
                        debug(err)
                        reject(err)
                    } else {
                        debug('SUCCESS=============================')
                        debug(result)
                        resolve(result)
                    }
                }
            )

        streamifier.createReadStream(file).pipe(uploadStream)
    })
}
exports.deleteFile = async (publicId) => {
    await cloudinary.uploader.destroy(publicId, (err, result) => {
        if (err) {
            debug('ERROR DELETE=============================')
            debug(err)
        } else {
            debug('SUCCESS DELETE=============================')
            debug(result)
        }
    })
}