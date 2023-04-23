const nodemailer = require('nodemailer')
const { MAIL_SETTINGS } = require('../config')
const { compileTemplate } = require('./templateParser')

const transporter = nodemailer.createTransport(MAIL_SETTINGS)

const sendMail = async params => {
  const html = compileTemplate('sendOTP.html', params)
  try {
    let info = await transporter.sendMail({
      from: MAIL_SETTINGS.auth.user,
      to: params.to,
      subject: 'Hello ✔',
      html: html,
    })
    console.log('_______________email send', info)
    return info
  } catch (error) {
    console.log('_______________email not send')
    throw new Error('unable to send mail', error, MAIL_SETTINGS)
  }
}

module.exports = {
  sendMail,
}
