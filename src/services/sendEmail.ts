import nodemailer from 'nodemailer'
import { MAIL_SETTINGS } from '../config'
import { compileTemplate } from './templateParser'

const transporter = nodemailer.createTransport(MAIL_SETTINGS)

interface MailParams {
  to: string
  subject?: string
  template?: string
  // Add any other parameters you expect for the email here
}

const sendMail = async (params: MailParams): Promise<nodemailer.SentMessageInfo> => {
  const html = compileTemplate('sendOTP.html', params)
  try {
    const info = await transporter.sendMail({
      from: MAIL_SETTINGS.auth.user,
      to: params.to,
      subject: 'Hello ✔',
      html
    })
    console.log('_______________email send', info)
    return info
  } catch (error) {
    console.log('_______________email not send')
    throw new Error('unable to send mail')
  }
}

export default sendMail
