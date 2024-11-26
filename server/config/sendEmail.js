// import { Resend } from "resend";
// import dotenv from "dotenv";

// dotenv.config();
// if (!process.env.RESEND_API) {
//   console.log("Provide RESEND_API in the .env file");
// }

// const resend = new Resend(process.env.RESEND_API);
// const sendEmail = async ({ sendTo, subject, html }) => {
//   try {
//     const { data, error } = await resend.emails.send({
//       from: "Swiftly <onboarding@resend.dev>",
//       to: sendTo,
//       subject: subject,
//       html: html,
//     });
//     if (error) {
//       return console.error({ error });
//     }

//     return data;
//   } catch (error) {
//     console.log(error);
//   }
// };

// export default sendEmail;
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.RESEND_API) {
  console.log("Provide RESEND_API in the .env file");
}

const resend = new Resend(process.env.RESEND_API);

const sendEmail = async ({ sendTo, subject, html }) => {
  try {
    console.log(`Attempting to send email to: ${sendTo}`);

    const { data, error } = await resend.emails.send({
      from: "Swiftly <onboarding@resend.dev>",
      to: sendTo,
      subject: subject,
      html: html,
    });

    if (error) {
      console.error("Error from Resend API:", error);
      return;
    }

    console.log("Email sent successfully:", data);
    return data;
  } catch (error) {
    console.error("Unexpected error sending email:", error);
    throw new Error("Failed to send email due to an internal error");
  }
};

export default sendEmail;
