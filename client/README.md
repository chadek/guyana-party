# Guyana-party (front)

Website for events in [Guiana](https://en.wikipedia.org/wiki/French_Guiana)

[Demo](https://guyana-party.dynu.net/)

[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/chadek/guyana-party/blob/master/LICENSE)

_This folder contains the frontend part of the project (the client)._

## Key Features

- Free and open source.
- Promotes events in Guiana.

## 🚀 Quick start

You need to have [Node.js](https://nodejs.org/) and [yarn](https://yarnpkg.com/lang/fr/docs/install/) installed on your machine.

1. **Clone this repository** or [download zip](https://github.com/spidergon/guyana-party-client/archive/master.zip).

2. **Start developing.**

   - Navigate into your site’s directory
   - Copy `.env_sample` to `.env.development` and fill it properly.
   - and start the project up:

   ```shell
   cd guyana-party-client/
   yarn start
   ```

3. **Open the source code and start editing!**

   Your site is now running at `http://localhost:8000`!

   _Note: You'll also see a second link: _`http://localhost:8000/___graphql`_. This is a tool you can use to experiment with querying your data. Learn more about using this tool in the [Gatsby tutorial](https://www.gatsbyjs.org/tutorial/part-five/#introducing-graphiql)._

   Open the `guyana-party-client` directory in your code editor of choice and edit `src/pages/index.js`. Save your changes and the browser will update in real time!

4. **When you're ready for production, go ahead and build the project:**

   - Copy `.env_sample` to `.env.production` and fill it properly.
   - Then start the build process:

   ```shell
   yarn build
   ```

5. **You can now serve the production build in `./public` folder**

   ```shell
   # To serve locally
   yarn serve
   ```

## 🧐 What's inside?

A quick look at the top-level files and directories you'll see in the project.

    .
    ├── jest
    ├── node_modules
    ├── src
    ├── .env_sample
    ├── .eslintrc.json
    ├── .gitignore
    ├── gatsby-browser.js
    ├── gatsby-config.js
    ├── gatsby-node.js
    ├── gatsby-ssr.js
    ├── jest.config.js
    ├── LICENSE
    ├── package.json
    ├── README.md
    └── yarn.lock

1.  **`/jest`**: This directory contains jest config files.

2.  **`/node_modules`**: This directory contains all of the modules of code that your project depends on (npm packages) are automatically installed.

3.  **`/src`**: This directory will contain all of the code related to what you will see on the front-end of your site (what you see in the browser) such as your site header or a page template. `src` is a convention for “source code”.

4.  **`.env_sample`**: The sample environment config file

5.  **`.eslintrc.json`**: The eslint config file

6.  **`.gitignore`**: This file tells git which files it should not track / not maintain a version history for.

7.  **`gatsby-browser.js`**: This file is where Gatsby expects to find any usage of the [Gatsby browser APIs](https://www.gatsbyjs.org/docs/browser-apis/) (if any). These allow customization/extension of default Gatsby settings affecting the browser.

8.  **`gatsby-config.js`**: This is the main configuration file for a Gatsby site. This is where you can specify information about your site (metadata) like the site title and description, which Gatsby plugins you’d like to include, etc. (Check out the [config docs](https://www.gatsbyjs.org/docs/gatsby-config/) for more detail).

9.  **`gatsby-node.js`**: This file is where Gatsby expects to find any usage of the [Gatsby Node APIs](https://www.gatsbyjs.org/docs/node-apis/) (if any). These allow customization/extension of default Gatsby settings affecting pieces of the site build process.

10. **`gatsby-ssr.js`**: This file is where Gatsby expects to find any usage of the [Gatsby server-side rendering APIs](https://www.gatsbyjs.org/docs/ssr-apis/) (if any). These allow customization of default Gatsby settings affecting server-side rendering.

11. **`LICENSE`**: The project is licensed under the MIT license.

12. **`package.json`**: A manifest file for Node.js projects, which includes things like metadata (the project’s name, author, etc). This manifest is how npm knows which packages to install for your project.

13. **`README.md`**: A text file containing useful reference information about your project.

14. **`yarn.lock`** (See `package.json` above, first). This is an automatically generated file based on the exact versions of your npm dependencies that were installed for your project. **(You won’t change this file directly).**

## 🎓 Learning Gatsby

Looking for more guidance? Full documentation for Gatsby lives [on the website](https://www.gatsbyjs.org/). Here are some places to start:

- **For most developers, we recommend starting with our [in-depth tutorial for creating a site with Gatsby](https://www.gatsbyjs.org/tutorial/).** It starts with zero assumptions about your level of ability and walks through every step of the process.

- **To dive straight into code samples, head [to our documentation](https://www.gatsbyjs.org/docs/).** In particular, check out the _Guides_, _API Reference_, and _Advanced Tutorials_ sections in the sidebar.
