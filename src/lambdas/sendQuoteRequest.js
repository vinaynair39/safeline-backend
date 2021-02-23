import { SES } from "aws-sdk";
import nodemailer from "nodemailer";
import commonMiddleware from "../lib/commonMiddleware";

const ses = new SES({
  region: "ap-south-1",
});

async function sendQuoteRequest(event, context) {
  try {
    const { email, service, name, phone, zip, message } = event.body;
    const mailOptions = {
      from: "marshallslim39@gmail.com",
      subject: "Safeline Electricals - Quote Request",
      html: `<div style="margin: 16px auto;"><h1>Safeline Electricals</h1><p style="font-size:20px;"><span style="padding-right: 8px;">Service:</span>${service}</p><ul style="font-size:20px;"><li><span style="padding-right: 8px;">Name:</span>${name}</li><li><span style="padding-right: 8px;">Email:</span>${email}</li><li><span style="padding-right: 8px;">Phone:</span>${phone}</li><li><span style="padding-right: 8px;">Zip code:</span>${zip}</li></ul><p style="font-size: 20px">${message}<p style="font-size: 20px"></div>`,
      to: "safelineelectricals@gmail.com",
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
    console.error(error);
    return {
      statusCode: 400,
      body: JSON.stringify({
        error,
        message: "some error occurred. Please try again later or call us.",
      }),
    };
  }
}

export const handler = commonMiddleware(sendQuoteRequest);
