import nodemailer from "nodemailer";

const sendMail = async (from, to, subject, text) => {
  try {
    // Create a transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "eklavyasinghparihar7875@gmail.com",
        pass: "ikhksvlaafwainih",
      },
    });

    // Define the email options
    const mailOptions = {
      from: from, // sender address
      to: to, // list of receivers
      subject: subject, // Subject line
      text: text, // plain text body
    };

    // Send mail with defined transport object
    let info = await transporter.sendMail(mailOptions);

    console.log("Message sent: %s", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
};

export default sendMail