import Controller from './Controller'
import PostService from '../services/PostService'
import Post from '../models/Post'

class PostController extends Controller {
  constructor (service) {
    super(service)
    this.service = service
  }

  create = async (req, res, next) => {
    req.body.imageUrl = this.getImgUrl(req)
    this.service.create(
      req.body,
      data => res.status(201).json(this.format({ data, status: 201 })),
      err => next({ ...err, status: 400 })
    )
  }

  update = async (req, res, next) => {
    if (req.file) req.body.imageUrl = this.getImgUrl(req)
    this.service.update(
      req.params.id,
      req.body,
      data => res.status(200).json(this.format({ data })),
      err => next({ ...err, status: err.status || 400 })
    )
  }
}

const postService = new PostService(new Post().getInstance())

export default new PostController(postService)
