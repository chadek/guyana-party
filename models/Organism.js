const mongoose = require('mongoose')
const slug = require('slugs')

mongoose.Promise = global.Promise

const OrganismSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: "Veuillez saisir le nom de l'organisme."
    },
    slug: String,
    description: {
      type: String,
      trim: true,
      required: 'Veuillez saisir une description.'
    },
    type: String, // association | ong | entreprise | collectivité
    created: {
      type: Date,
      default: Date.now
    },
    location: {
      type: {
        type: String,
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        default: [0, 0]
      },
      address: {
        type: String
        // required: "Veuillez sélectionner le l'adresse de l'organisme sur la carte, ou saisir une adresse."
      }
    },
    photo: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: "L'auteur de l'organisme est requis."
    },
    community: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: "La référence de l'utilisateur est requise."
        },
        role: {
          type: String, // guest | admin
          default: 'guest'
        }
      }
    ],
    subscription: String, // free < asso < pro < complete
    status: {
      type: String, // published | archived
      default: 'published'
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

// Define our indexes
OrganismSchema.index({
  name: 'text',
  description: 'text'
})

OrganismSchema.index({ location: '2dsphere' })

OrganismSchema.pre('save', async function (next) {
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

module.exports = mongoose.model('Organism', OrganismSchema)
