import multer from 'multer'

const options = {
  storage: multer.memoryStorage(),
  limits: { fileSize: 1048576 }, // 1024 * 1024 * 1 (1Mo)
  fileFilter (req, file, next) {
    if (file.mimetype.startsWith('image/')) {
      next(null, true)
    } else {
      next({ message: 'Type de fichier non autorisé !' }, false)
    }
  }
}

export default (req, res, next) => {
  const mult = multer(options).any()
  mult(req, res, err => {
    if (err) return next(err)
    if (!req.files) return next()
    req.body.photos = req.files.map(p => {
      return { data: p.buffer, contentType: p.mimetype }
    })
    next()
  })
}
