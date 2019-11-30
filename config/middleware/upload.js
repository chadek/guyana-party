import multer from 'multer'
import uuid from 'uuid/v4'

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'uploads')
  },
  filename: (req, file, callback) => {
    callback(null, `${uuid()}.${file.mimetype.split('/')[1]}`)
  }
})

const options = {
  storage,
  limits: { fileSize: 1048576 }, // 1024 * 1024 * 1 (1Mo)
  fileFilter (req, file, next) {
    if (file.mimetype.startsWith('image/')) {
      next(null, true)
    } else {
      next({ message: 'Type de fichier non autorisé !' }, false)
    }
  }
}

export default multer(options).any()
