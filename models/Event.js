const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const slug = require("slugs");

const eventSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: "Please enter a store name!"
        },
        slug: String,
        description: {
            type: String,
            trim: true
        },
        tags: [String],
        created: {
            type: Date,
            default: Date.now
        },
        start: Date,
        end: Date,
        location: {
            type: {
                type: String,
                default: "Point"
            },
            coordinates: [{
                type: Number,
                required: "You must supply coordinates!"
            }],
            address: {
                type: String,
                required: "You must supply an adress!"
            }
        },
        photo: String,
        flyer: String,
        author: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: "You must supply an author"
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Define our indexes
eventSchema.index({
    name: "text",
    description: "text"
});

eventSchema.index({ location: "2dsphere" });

eventSchema.pre("save", async function(next) {
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

eventSchema.statics.getTagsList = function() {
    return this.aggregate([
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
  };

module.exports = mongoose.model("Event", eventSchema);