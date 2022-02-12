var nodemailer = require('nodemailer')
const dotenv = require('dotenv')
var fs = require('fs') //Filesystem
const path = require('path')

var content = fs.readFileSync(`${path.join(__dirname, '/emailUI.html')}`)

dotenv.config()

async function generateEmail (listOfEmails) {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: `${process.env.ADMIN_EMAIL}`,
      pass: `${process.env.ADMIN_PASSWORD}`
    },
    tls: {
      rejectUnauthorized: false
    }
  })

  const mailOptions = {
    from: `${process.env.ADMIN_EMAIL}`,
    to: `${listOfEmails}`,
    subject: 'New Log Added',
    html: `${content}`
  }

  transporter.sendMail(mailOptions, function (err) {
    if (err) throw new Error('Could not send mail')
  })
}

module.exports = generateEmail
