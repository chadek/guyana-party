const mongoose = require('mongoose')
const slug = require('slugs')

mongoose.Promise = global.Promise

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: "Veuillez saisir le nom de l'évènement."
    },
    slug: String,
    description: {
      type: String,
      trim: true,
      required: 'Veuillez saisir une description.'
    },
    tags: [String],
    created: {
      type: Date,
      default: Date.now
    },
    start: Date,
    end: Date,
    occurring : [Number],
    published: {
      date: Date,
      publisher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
        // required: 'Publisher required'
      }
    },
    location: {
      type: {
        type: String,
        default: 'Point'
      },
      coordinates: [Number],
      address: {
        type: String,
        required: "Veuillez sélectionner le lieu de l'évènement sur la carte."
      }
    },
    photo: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: "L'auteur de l'évènement est requis."
    },
    organism: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organism'
      // required: "L'organisme de l'évènement est requis."
    },
    timezone: String, // ex: "(UTC-03:00) America/Cayenne"
    status: {
      type: String, // paused | published | archived
      default: 'paused'
    },
    public: {
      type: Boolean,
      default: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

// Define our indexes
eventSchema.index({
  name: 'text',
  description: 'text'
})

eventSchema.index({ location: '2dsphere' })

eventSchema.pre('save', async function (next) {
  const self = this // eslint-disable-line babel/no-invalid-this
  if (!self.isModified('name')) {
    next() // skip it
    return // stop this function from running
  }
  self.slug = slug(self.name)
  // find other stores that have a slug of event, event-1, event-2
  const slugRegEx = new RegExp(`^(${self.slug})((-[0-9]*$)?)$`, 'i')
  const eventsWithSlug = await self.constructor.find({ slug: slugRegEx })
  if (eventsWithSlug.length) {
    self.slug = `${self.slug}-${eventsWithSlug.length + 1}`
  }
  next()
})

eventSchema.statics.getTagsList = function () {
  return this.aggregate([
    { $unwind: '$tags' },
    { $group: { _id: '$tags', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ])
}

function autopopulate (next) {
  this.populate('organism') // eslint-disable-line babel/no-invalid-this
  next()
}

eventSchema.pre('find', autopopulate)
eventSchema.pre('findOne', autopopulate)

module.exports = mongoose.model('Event', eventSchema)
