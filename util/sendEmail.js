require('dotenv').config();
const nodemailer = require("nodemailer");

const sendEmail = async (setLink, email) => {
  //Step 1
  let transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    },
  });


  //Step 2

  // mailOptions = {
  //   from: process.env.EMAIL,
  //   to: email,
  //   subject: "Employee message",
  //   text: setLink,
  // };

  mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Employee message",
    html: setLink
  };



  //Step 3
  await transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log("Error Occurs", err);
    } else {
      console.log("Email sent successfully");
    }
  })


}

module.exports = sendEmail;