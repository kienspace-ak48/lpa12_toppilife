const orderService = require("../services/order.service");
const feedbackModel = require("../model/feedback.model");
const { verifyTurnstileToken } = require("../services/turnstile.service");

const CNAME = "api.controller.js ";

const ORDER_NAME_MAX = 100;
const ORDER_EMAIL_MAX = 254;
const ORDER_PHONE_MAX = 20;
const ORDER_ADDRESS_MAX = 150;

const trimStr = (v) => String(v ?? "").trim();

const apiController = () => {
  return {
    Order: async (req, res) => {
      try {
        const data = req.body;
        const cfToken =
          data.cfTurnstileResponse ||
          data["cf-turnstile-response"] ||
          data.turnstileToken;
        const skipTurnstile =
          process.env.TURNSTILE_SKIP === "1" ||
          process.env.TURNSTILE_SKIP === "true";
        if (!skipTurnstile) {
          const turnstileOk = await verifyTurnstileToken(cfToken);
          if (!turnstileOk) {
            return res.status(400).json({
              success: false,
              mess: "Xác minh bảo mật thất bại. Vui lòng thử lại.",
            });
          }
        }

        const name = trimStr(data.name);
        const address = trimStr(data.address);
        const phone = trimStr(data.phone);
        const email = trimStr(data.email);

        if (!name || name.length > ORDER_NAME_MAX) {
          return res.status(400).json({
            success: false,
            mess: `Họ tên không hợp lệ (tối đa ${ORDER_NAME_MAX} ký tự).`,
          });
        }
        if (!phone || phone.length > ORDER_PHONE_MAX || !/^[\d\s+().-]{8,}$/.test(phone)) {
          return res.status(400).json({
            success: false,
            mess: "Số điện thoại không hợp lệ.",
          });
        }
        if (!email || email.length > ORDER_EMAIL_MAX) {
          return res.status(400).json({
            success: false,
            mess: "Email không hợp lệ.",
          });
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          return res.status(400).json({
            success: false,
            mess: "Email không đúng định dạng.",
          });
        }
        if (!address || address.length > ORDER_ADDRESS_MAX) {
          return res.status(400).json({
            success: false,
            mess: `Địa chỉ không hợp lệ (tối đa ${ORDER_ADDRESS_MAX} ký tự).`,
          });
        }

        const oDTO = {
          name,
          address,
          phone,
          email,
        };
        const task1 = await orderService.addAndSendmail(oDTO);
        if (!task1) {
          return res.status(500).json({ success: false, mess: "Order failed" });
        }
        res.json({ success: true });
      } catch (error) {
        console.log(CNAME, error.message);
        return res.status(500).json({ success: false, mess: error.message });
      }
    },
    FeedbackList: async (req, res) => {
      try {
        const items = await feedbackModel
          .find({ isDeleted: false })
          .sort({ createdAt: -1 })
          .select("-__v")
          .lean();
        return res.json({ success: true, data: items });
      } catch (error) {
        console.log(CNAME, error.message);
        return res.status(500).json({ success: false, data: [] });
      }
    },
    VerifyTurnstile: async (req, res) => {
      try {
        const { token_turnstile } = req.body;
        const turnstileOk = await verifyTurnstileToken(token_turnstile);
        if (!turnstileOk) {
          return res
            .status(400)
            .json({
              success: false,
              mess: "Token Turnstile verification failed",
            });
        }

        return res
          .status(200)
          .json({
            success: true,
            mess: "Token Turnstile verification successfully",
          });
      } catch (error) {
        console.log(CNAME, error.message);
        return res.status(500).json({ success: false, mess: error.message });
      }
    },
  };
};

module.exports = apiController;
