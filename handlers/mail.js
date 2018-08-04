const nodemailer = require('nodemailer')
const pug = require('pug')
const juice = require('juice')
const htmlToText = require('html-to-text')
const { promisify } = require('es6-promisify')

const transport = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
})

const generateHTML = (filename, options = {}) => {
  const html = pug.renderFile(
    `${__dirname}/../views/email/${filename}.pug`,
    options
  )
  return juice(html)
}

exports.send = async options => {
  const html = generateHTML(options.filename, options)
  const text = htmlToText.fromString(html)

  const mailOptions = {
    from: process.env.MAIL_FROM,
    to: options.user.email,
    subject: options.subject,
    html,
    text
  }
  const sendMail = promisify(transport.sendMail.bind(transport))
  return sendMail(mailOptions)
}
