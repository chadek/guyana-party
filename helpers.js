/*
  This is a file of data and helper functions that we can expose and use in our templating function
*/

// FS is a built in module to node that let's us read files from the system we're running on
const fs = require('fs')

// moment.js is a handy library for displaying dates. We need this in our templates to display things like "Posted 5 minutes ago"
// exports.moment = require("moment");

// local storage
exports.store = require('store')

// Dump is a handy debugging function we can use to sort of "console.log" our data
exports.dump = obj => JSON.stringify(obj, null, 2)

// inserting an SVG
exports.icon = name => fs.readFileSync(`./public/images/icons/${name}.svg`)

// profile photo
exports.profilePhotoSrc = user => (user.photo ? `/uploads/${user.photo}` : `${user.gravatar}&d=retro`)

// exports.translateSubs = subscription => {
//   if (subscription === 'free') return 'Gratuite'
//   if (subscription === 'asso') return 'Association'
// }

// Some details about the site
exports.siteName = `Guyana Party`

// exports.menu = [{ slug: "/events", title: "Evènements", icon: "events" }];
