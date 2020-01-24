import nodemailer from 'nodemailer'
import htmlToText from 'html-to-text'
import { logError } from './logger'

const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
})

transport.verify(error => {
  if (error) logError(error)
})

export const sendMail = async ({ to, subject, html }, next, fallback) =>
  transport.sendMail(
    {
      from: `Guyana Party <noreply@toucandigitalpartner.com>`,
      to,
      subject,
      html,
      text: htmlToText.fromString(html)
    },
    err => {
      if (err) {
        logError(err)
        return fallback(err)
      }
      next()
    }
  )
