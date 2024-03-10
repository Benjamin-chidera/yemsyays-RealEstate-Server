const nodemailer = require("nodemailer");
const Contact = require("../models/contact");



 

const contact = async (req, res) => {
  const { name, email, message, phoneNumber } = req.body;

  try {
    const contactSMS = await Contact.create(req.body);

    res.status(201).json({ msg: "Contact created successfully", contactSMS });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: process.env.PORTS,
      secure: false,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    const mailOptions = {
      from: "benjaminchidera72@gmail.com",
      to: email,
      subject: "Contact Yemsays",
      text: `Message: ${message}\nPhone Number: ${phoneNumber}`,
      html: `<p>Message: ${message}</p><p>Phone Number: ${phoneNumber}</p><p>Name: ${name}</p>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        res.status(500).json({ error: "Error sending email" });
      } else {
        console.log("Email sent successfully");
        res.status(200).json({ message: "Email sent successfully" });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = contact;