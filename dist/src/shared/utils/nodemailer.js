"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = (email, subject, message) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transporter = nodemailer_1.default.createTransport({
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
        yield transporter.sendMail({
            from: "klickedusm@gmail.com",
            to: email,
            subject: subject,
            html: message,
        });
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
});
module.exports = { sendEmail };
