const { Post, User } = require('../models')
const ApiResponse = require('../utils/apiResponse')
const { Op } = require('sequelize')

exports.createPost = async (req, res, next) => {
  try {
    const postData = {
      authorId: req.user.id,
      authorType: req.user.role,
      content: req.body.content || '',
      tags: req.body.tags || [],
      location: req.body.location,
    }

    if (req.files?.images) postData.images = req.files.images.map(f => f.path)
    if (req.files?.videos) postData.videos = req.files.videos.map(f => f.path)

    const post = await Post.create(postData)
    ApiResponse.created(res, { post }, 'Publication créée')
  } catch (error) {
    next(error)
  }
}

exports.getFeed = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query
    const { count, rows } = await Post.findAndCountAll({
      include: [{ association: 'author', attributes: ['id', 'name', 'avatar', 'role'] }],
      offset: (page - 1) * limit,
      limit: parseInt(limit),
      order: [['createdAt', 'DESC']],
    })

    ApiResponse.paginated(res, { posts: rows }, count, parseInt(page), parseInt(limit))
  } catch (error) {
    next(error)
  }
}

exports.getUserPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query
    const { count, rows } = await Post.findAndCountAll({
      where: { authorId: req.params.userId },
      include: [{ association: 'author', attributes: ['id', 'name', 'avatar', 'role'] }],
      offset: (page - 1) * limit,
      limit: parseInt(limit),
      order: [['createdAt', 'DESC']],
    })

    ApiResponse.paginated(res, { posts: rows }, count, parseInt(page), parseInt(limit))
  } catch (error) {
    next(error)
  }
}

exports.likePost = async (req, res, next) => {
  try {
    const post = await Post.findByPk(req.params.id)
    if (!post) return ApiResponse.notFound(res, 'Publication non trouvée')
    await post.increment('likeCount')
    ApiResponse.success(res, { likeCount: post.likeCount + 1 })
  } catch (error) {
    next(error)
  }
}

exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findByPk(req.params.id)
    if (!post) return ApiResponse.notFound(res, 'Publication non trouvée')
    if (post.authorId !== req.user.id && req.user.role !== 'admin') return ApiResponse.forbidden(res)
    await post.destroy()
    ApiResponse.success(res, null, 'Publication supprimée')
  } catch (error) {
    next(error)
  }
}
