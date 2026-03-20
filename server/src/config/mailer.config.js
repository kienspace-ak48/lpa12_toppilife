const nodemailer = require('nodemailer');

const mailTransporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587, //587 TSL false: ket noi thuong->nang cap TLS | 465 SSL true: ma hoa ngay tu dau
    secure: false,
    auth: {
        user: process.env.GGMAIL_USER,
        pass: process.env.GGMAIL_PASS,
    },
});

module.exports = mailTransporter;