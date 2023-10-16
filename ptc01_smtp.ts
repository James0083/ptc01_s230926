import * as nodemailer from 'nodemailer';

const smtpConfig = {
  host: 'smtp.example.com',
  port: 587,
  secure: false,
  auth: {
    user: 'your_username',
    pass: 'your_password'
  }
};

const transporter = nodemailer.createTransport(smtpConfig);

const mailOptions = {
  from: 'ptc01_sender@jaewon.com',
  to: 'jeawon0830@naver.com',
  subject: 'Test Email',
  text: 'This is a test email from Node.js SMTP client.'
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Error sending email:', error);
  } else {
    console.log('Email sent:', info.response);
  }
});
