import multer from 'multer'
import jimp from 'jimp'
import { uuid } from 'uuidv4'

const options = {
  storage: multer.memoryStorage(),
  limits: { fileSize: 1048576 } // 1024 * 1024 * 1 (1Mo)
  // fileFilter (req, file, next) {
  //   if (file.mimetype.startsWith('image/')) {
  //     next(null, true)
  //   } else {
  //     next({ message: 'Type de fichier non autorisé !' }, false)
  //   }
  // }
}

const asyncForEach = async function (array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

export default async (req, res, next) => {
  const mult = multer(options).any()
  mult(req, res, err => {
    if (err) return next(err)
    if (!req.files) return next()
    // req.body.photos = req.files.map(p => {
    //   return { data: p.buffer, contentType: p.mimetype }
    // })
    req.body.photos = req.body.photos || []
    asyncForEach(req.files, async p => {
      const extension = p.mimetype.split('/')[1]
      const fileName = `${uuid()}.${extension}`
      req.body.photos.push(fileName)
      const photo = await jimp.read(p.buffer)
      await photo.resize(800, jimp.AUTO)
      await photo.quality(60)
      await photo.write(`./uploads/${fileName}`)
    })
    next()
  })
}
