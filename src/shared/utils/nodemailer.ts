
import nodemailer from "nodemailer"

const sendEmail = async (email: string, subject: string, message: string) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            service: "gmail",
            port: 465, //587
            secure: true,
            auth: {
                user: "quizgeneral.info@gmail.com",
                pass: "rdgg flkf txxi xpvr",
            },
            tls: {
                ciphers: "SSLv3",
            },
        });

        await transporter.sendMail({
            from: "klickedusm@gmail.com",
            to: email,
            subject: subject,
            html: message,
        });
        console.log("email sent successfully");
        return true;
    } catch (error) {
        console.log("email not sent");
        console.log(error);
        return false;
    }
};

export = { sendEmail };