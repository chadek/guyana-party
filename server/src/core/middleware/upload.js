import multer from 'multer'
import jimp from 'jimp'
import { uuid } from 'uuidv4'
import fs from 'fs'
import { logError } from '../logger'
import { cloudinaryEnv } from '../env'

const cloudinary = require('cloudinary').v2

const options = {
  storage: multer.memoryStorage(),
  limits: { fileSize: 1048576 }, // 1024 * 1024 * 1 (1Mo)
  fileFilter(req, file, next) {
    if (file.mimetype.startsWith('image/')) {
      next(null, true)
    } else {
      next({ message: 'Type de fichier non autorisé !' }, false)
    }
  }
}

const asyncForEach = async function(array, callback) {
  for (let index = 0; index < array.length; index += 1) {
    await callback(array[index], index, array)
  }
}

export default (req, res, next) => {
  const mult = multer(options).any()
  mult(req, res, async err => {
    if (err) return next(err)
    if (!req.files) return next()

    req.body.photos = req.body.photos || []

    await asyncForEach(req.files, async p => {
      const fileName = `./uploads/${uuid()}`

      const photo = await jimp.read(p.buffer)
      if (photo.bitmap.width > 500) {
        await photo.resize(500, jimp.AUTO)
      }
      await photo.quality(60)
      await photo.write(fileName)

      return cloudinary.uploader
        .upload(fileName, { folder: cloudinaryEnv })
        .then(data => {
          req.body.photos.push(data.secure_url)
          fs.unlink(fileName, err => {
            if (err) logError(err)
          })
        })
        .catch(logError)
    })
    next()
  })
}
