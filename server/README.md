# Guyana-party (back)

Website for events in [Guiana](https://en.wikipedia.org/wiki/French_Guiana)

[Demo](https://guyana-party.dynu.net/)

[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/chadek/guyana-party/blob/master/LICENSE)

_This folder contains the backend part of the project (the API)._

## Key Features

- Free and open source.
- Promotes events in Guiana.

## 🧐 Stack

- Node (Web server)
- Express (Web server framework)
- MongoDB (Nosql database)
- JSON Web Token (Authentication)
- Jest (Testing)
- Logs (Winston)

## 🚀 Quick start

You need to have [Node.js](https://nodejs.org/) and [MongoDB](https://docs.mongodb.com/guides/server/install/) installed on your machine.

1. Clone this repository or [download zip](https://github.com/chadek/guyana-party/archive/master.zip).
2. Copy `.env.sample` to `.env` and fill it properly.
3. Install dependencies: **`yarn install`**.
4. Start MongoDB database: **`sudo service mongod start`**.
5. Run for development: **`yarn dev`**.
6. Run for production: **`yarn start`**.
7. Run lint test: **`yarn lint`** -> results in file `./eslint_result.html`.
8. Run unit tests:
   - **`yarn test`** to run once
   - **`yarn test:watch`** to run in watch mode
   - **`yarn test:cov`** to run and see coverage
