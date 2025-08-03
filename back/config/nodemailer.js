import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.GOOGLE_CLIENT,
        pass: process.env.GOOGLE_SECRET
    }

});

transporter.verify().then(() => console.log("Servicio de Gmail funcionando ok")).catch(error => console.error(error))

export default transporter;