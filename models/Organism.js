const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const slug = require("slugs");

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
      required: "Veuillez saisir une description."
    },
    type: String, // association | ong | entreprise | collectivité
    created: {
      type: Date,
      default: Date.now
    },
    location: {
      type: {
        type: String,
        default: "Point"
      },
      coordinates: {
        type: [Number],
        default: [0, 0]
      },
      address: {
        type: String
        //required: "Veuillez sélectionner le l'adresse de l'organisme sur la carte, ou saisir une adresse."
      }
    },
    photo: String,
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: "L'auteur de l'organisme est requis."
    },
    community: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
          required: "La référence de l'utilisateur est requise."
        },
        role: {
          type: String, // guest | admin
          default: "guest"
        }
      }
    ],
    subscription: String, // free < asso < pro < complete
    status: {
      type: String, // published | archived
      default: "published"
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Define our indexes
OrganismSchema.index({
  name: "text",
  description: "text"
});

OrganismSchema.index({ location: "2dsphere" });

OrganismSchema.pre("save", async function(next) {
  if (!this.isModified("name")) {
    next(); // skip it
    return; // stop this function from running
  }
  this.slug = slug(this.name);
  // find other stores that have a slug of event, event-1, event-2
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, "i");
  const eventsWithSlug = await this.constructor.find({ slug: slugRegEx });
  if (eventsWithSlug.length) {
    this.slug = `${this.slug}-${eventsWithSlug.length + 1}`;
  }
  next();
});

module.exports = mongoose.model("Organism", OrganismSchema);
