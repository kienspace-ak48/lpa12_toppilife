const fs = require("fs");
const path = require("path");
const CNAME = "mail.service.js ";
const transporter = require("../config/mailer.config");
const myPathConfig = require("../config/myPath.config");

const sendMail = async ({ from, to, subject, dataMail, html }) => {
  try {
    const filePath = path.join(myPathConfig.root,"/src/views/template_files/mail_one.html",);
    //doc noi dung cua file
    const template = fs.readFileSync(filePath, "utf-8");
    //change data dynamic
    const htmlContent = template
      .replaceAll("{{orderId}}", dataMail.order_id)
      .replaceAll("{{customerName}}", dataMail.order_name)
      .replaceAll("{{customerEmail}}", dataMail.order_email)
      .replaceAll("{{orderLink}}", dataMail.order_link)
      .replaceAll("{{customerPhone}}", dataMail.order_phone)
      .replaceAll("{{customerAddress}}", dataMail.order_address || "");

    //
    const payload = {
      from, // `"My App" <info.kienvu.vn>`,
      to, // "kienvu.dev@gmail.com", //q.giang2508@gmail.com
      subject,
      html: htmlContent,
    };
    //goi ham gui mail cua nodemailer
    const info = await transporter.sendMail(payload);
    return {
      success: true,
      message_id: info.messageId,
    };
  } catch (error) {
    console.log(CNAME, error.message);
    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = {
  sendMail,
};
