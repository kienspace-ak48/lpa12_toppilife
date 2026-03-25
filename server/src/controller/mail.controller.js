const fs = require("fs");
const path = require("path");
const myPathConfig = require("../config/myPath.config");
const { sendMail } = require("../services/mail.service");

const CNAME = "email.controller.js ";
const emailController = () => {
  return {
    Index: (req, res) => {},
    SendMail: async (req, res) => {
      try {
        const filePath = path.join(
          myPathConfig.root,
          "/src/views/template_files/mail_one.html",
        );
        //doc noi dung cua file
        const template = fs.readFileSync(filePath, "utf-8");
        //change data dynamic
        const htmlContent = template
        .replaceAll("{{orderId}}", "DH123456")
        .replaceAll("{{customerName}}", "Nguyễn Văn A")
        .replaceAll("{{customerEmail}}", "a@gmail.com")
        // .replaceAll("{{totalAmount}}", "1.500.000đ")
        .replaceAll("{{orderLink}}", "https://yourdomain.com/orders/123");
        
        //
        const payload = {
          to: "kienvu.dev@gmail.com", //q.giang2508@gmail.com
          subject: "Ban co don hang moi",
          html: htmlContent,
        };
        const task1 = await sendMail(payload);
        if (!task1.success) {
          return res.status(500).json({ error: task1.error });
        }
        res.json({ message: "Email sent successfully", id: task1.message_id });
      } catch (error) {
        console.log(CNAME, error.message);
        res.status(500).json({ success: false, mess: "failed" });
      }
    },
  }
};

module.exports = emailController;
