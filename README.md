# Guyana-party

Website for events in [Guiana](https://en.wikipedia.org/wiki/French_Guiana)

[Demo](https://guyana-party.dynu.net/)

[Storyboard](https://drive.google.com/open?id=1IzKCFOBUTsCAGs10hMsByWX8i1DBJGUgBmVxWefcEpA)

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/chadek/guyana-party/blob/master/LICENSE)

## Key Features

- Free and open source.
- Promote events in Guiana.

## Stack

- Node (Web server)
- Express (Web server framework)
- Passport (Authentication)
- MongoDB (nosql database)
- Pug (Templating)
- OpenLayer and OpenStreetMap (Maps)
- SimpleMDE (embedded JS markdown editor)

## Setup

You need to have [Node.js](https://nodejs.org/) and [MongoDB](https://docs.mongodb.com/guides/server/install/) installed on your machine.

1. Clone this repository or [download zip](https://github.com/chadek/guyana-party/archive/master.zip).
2. Copy `variables.env.sample` to `variables.env` and fill it properly.
3. Install dependencies: `npm install`.
4. Start MongoDB database: `sudo service mongod start`.
5. Run for development: `npm run dev`.
6. Run for production: `npm run build` then `npm start`.
7. Run unit tests: `npm test` or `npm run test:watch`
