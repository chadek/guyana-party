class Controller {
  constructor (service) {
    this.service = service
  }

  readAll = async (req, res, next) => {
    this.service.readAll(
      req.query,
      data => res.json(this.format({ data, total: data.length })),
      err => next({ ...err, status: 400 })
    )
  }

  read = async (req, res, next) => {
    this.service.read(
      req.params.id,
      data => res.json(this.format({ data })),
      err => next({ ...err, status: 400 })
    )
  }

  create = async (req, res, next) => {
    this.service.create(
      req.body,
      data => res.status(201).json(this.format({ data, status: 201 })),
      err => next({ ...err, status: 400 })
    )
  }

  update = async (req, res, next) => {
    this.service.update(
      req.params.id,
      req.body,
      data => res.status(200).json(this.format({ data })),
      err => next({ ...err, status: err.status || 400 })
    )
  }

  delete = async (req, res, next) => {
    this.service.delete(
      req.params.id,
      data => res.status(200).json(this.format({ data })),
      err => next({ ...err, status: err.status || 400 })
    )
  }

  format = ({ status = 200, error, message, total, data, custom }) => ({
    status,
    error,
    message,
    total,
    data,
    ...custom
  })

  getImgUrl (req) {
    if (!req.file) return ''
    return `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
  }
}

export default Controller
