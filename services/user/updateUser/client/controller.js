const Joi = require("joi")
const debug = require('debug')('app:client|user|updateUser')
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
        cb(new AppError('photo is invalid !', 400, constants.STATUS_CODE.VALIDATION_ERROR), false)
    } else {
        cb(null, true)
    }
}
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: {fileSize: 5000000}
})

exports.uploadPhoto = upload.fields([
    { name: 'photo', maxCount: 1 }
])
exports.resizePhoto = catchAsync(async (req, res, next) => {
    if (!req.files.photo) {
        return next()
    }
    const photo = await sharp(req.files.photo[0].buffer)
        // .resize(820, 360)
        .toFormat('png')
        .png({ quality: 90 })
        .toBuffer()
    req.files.photo[0].buffer = photo
    req.files.photo[0].filename = `user-${Date.now()}.png`
    next()
})

exports.updateUser = (client) => catchAsync(async (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(255).required(),
        username: Joi.string().min(3).max(255).required(),
        email: Joi.string().email().required(),
    })

    const {error} = schema.validate(req.body)
    if (error) {
        return next(new AppError(error.message.replace(/"/g, ''), 400, constants.STATUS_CODE.VALIDATION_ERROR))
    }

    const user = await client().getUserById({
        userId: req.user.userId
    })

    if (!user) {
        return next(new AppError('Data not found', 400, constants.STATUS_CODE.VALIDATION_ERROR))
    }

    let photo = null
    if (req.files.photo) {
        if (user.photo) {
            const splitExt = user.photo.split('.')
            const splitSlash = splitExt[2].split('/machinevision/user/')[1]
            const publicId = `machinevision/user/${splitSlash}`
            await deleteFile(publicId)
        }
        let splitName = req.files.photo[0].filename.split('.')
        const resImage = await uploadFile(req.files.photo[0].buffer, 'machinevision/user', splitName[0])

        if (resImage) {
            photo = resImage.secure_url
        }
    }

    let request = {
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        userId: req.user.userId,
        photo: photo
    }

    const result = await client().updateUser(request)

    if (!result.photo) {
        result.photo = null
    }

    res.status(200).json(responseHandler(
        { name: result.name, username: result.username, email: result.email, photo: result.photo, createdAt: result.createdAt, updatedAt: result.updatedAt },
        constants.STATUS_CODE.SUCCESS,
        'Successfully Update User'
    ))
})