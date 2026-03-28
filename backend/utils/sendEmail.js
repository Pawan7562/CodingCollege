const nodemailer = require('nodemailer');

<<<<<<< HEAD
const sendEmail = async (options) => {
  // Create a transporter
  const transporter = nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Define email options
  const mailOptions = {
    from: `${process.env.EMAIL_USER}`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  // Send the email
  await transporter.sendMail(mailOptions);
=======
const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
  });

  await transporter.sendMail({
    from: `College <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  });
>>>>>>> efb84c1ad6217944445d6b2bf48b8ad3d0887842
};

module.exports = sendEmail;
