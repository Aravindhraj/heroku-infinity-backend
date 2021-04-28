var nodemailer = require('nodemailer');
const dotenv = require("dotenv");

var transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD
  }
});

var mailOptions = {
  from: process.env.MAIL_USER,
};

exports.sendEmail = async (input) => {
  mailOptions.subject = input.subject;
  mailOptions.text = input.text;
  mailOptions.to = input.to;
  transporter.sendMail(mailOptions, function (error, info) {

    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}