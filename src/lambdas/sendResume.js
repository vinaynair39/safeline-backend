import commonMiddleware from "../lib/commonMiddleware";
import nodemailer from "nodemailer";
import { SES } from "aws-sdk";

const ses = new SES({
  region: "ap-south-1",
});

async function sendResume(event, context) {
  try {
    const { email, name, phone, zip, message, resume } = event.body;
    const mailOptions = {
      from: "marshallslim39@gmail.com",
      subject: "Safeline Electricals - New Job Application ",
      html: `<div style="margin: 16px auto;"><h1>Safeline Electricals</h1><p style="font-size:20px;">${"Job Application"}</p><ul style="font-size:20px;"><li><span style="padding-right: 8px;">Name:</span>${name}</li><li><span style="padding-right: 8px;">Email:</span>${email}</li><li><span style="padding-right: 8px;">Phone:</span>${phone}</li><li><span style="padding-right: 8px;">Zip code:</span>${zip}</li></ul><p style="font-size: 20px">${message}<p style="font-size: 20px"></div>`,
      to: "safelineelectricals@gmail.com",
      attachments: [
        {
          filename: `resume.${resume.extension}`,
          content: resume.data.split("base64,")[1],
          encoding: "base64",
        },
      ],
    };

    const transporter = nodemailer.createTransport({
      SES: ses,
    });
    await transporter.sendMail(mailOptions);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Successfully posted! You will hear from us shortly.",
      }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error,
        message: "some error occurred. Please try again later or call us.",
      }),
    };
  }
}

export const handler = commonMiddleware(sendResume);
