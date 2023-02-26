const Joi = require("joi")
const debug = require('debug')('app:client|post|createPost')
const responseHandler = require('@utils/responseHandler')
const catchAsync = require('@utils/catchAsync')
const constants = require('@utils/constants')
const AppError = require('@utils/appError')
const multer = require('multer')
const sharp = require('sharp')
const {uploadFile, deleteFile} = require('@utils/fileSystem')

const multerStorage = multer.memoryStorage()
const multerFilter = (req, file, cb) => {
    let isError
    if (file.mimetype.startsWith('image')) {
        if (file.mimetype.includes('jpg') || file.mimetype.includes('jpeg') || file.mimetype.includes('png')) {
            isError = false
        } else {
            isError = true
        }
    } else {
        isError = true
    }
    if (isError) {
        cb(new AppError('image is invalid !', 400, constants.STATUS_CODE.VALIDATION_ERROR), false)
    } else {
        cb(null, true)
    }
}
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: {fileSize: 5000000}
})

exports.uploadImage = upload.fields([
    { name: 'image', maxCount: 1 }
])
exports.resizeImage = catchAsync(async (req, res, next) => {
    if (!req.files.image) {
        return next(new AppError('image is required', 400, constants.STATUS_CODE.VALIDATION_ERROR))
    }
    const image = await sharp(req.files.image[0].buffer)
        // .resize(820, 360)
        .toFormat('png')
        .png({ quality: 90 })
        .toBuffer()
    req.files.image[0].buffer = image
    req.files.image[0].filename = `post-${req.user.userId}-${Date.now()}.png`
    next()
})

exports.createPost = (client) => catchAsync(async (req, res, next) => {
    const schema = Joi.object({
        caption: Joi.string().min(3),
        tags: Joi.string().min(3)
    })

    const {error} = schema.validate(req.body)
    if (error) {
        return next(new AppError(error.message.replace(/"/g, ''), 400, constants.STATUS_CODE.VALIDATION_ERROR))
    }

    let image = null
    if (req.files.image) {
        let splitName = req.files.image[0].filename.split('.')
        const resImage = await uploadFile(req.files.image[0].buffer, 'machinevision/post', splitName[0])

        if (resImage) {
            image = resImage.secure_url
        }
    }

    let request = {
        userId: req.user.userId,
        image: image
    }
    if (req.body.caption) {
        request.caption = req.body.caption
    }
    if (req.body.tags) {
        request.tags = req.body.tags
    }

    const { post, user } = await client().createPost(request)

    if (!post.caption) {
        post.caption = null
    }

    if (!post.tags) {
        post.tags = null
    }

    if (!user.photo) {
        user.photo = null
    }

    res.status(200).json(responseHandler(
        {
            image: post.image, caption: post.caption, tags: post.tags, likes: post.likes,
            createdAt: post.createdAt, updatedAt: post.updatedAt,
            user: {
                name: user.name,
                username: user.username,
                email: user.email,
                photo: user.photo
            }
        },
        constants.STATUS_CODE.SUCCESS,
        'Successfully Create Post'
    ))
})