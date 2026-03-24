const orderService = require("../services/order.service");
const feedbackModel = require("../model/feedback.model");

const CNAME = "api.controller.js ";

const apiController = () => {
  return {
    Order: async (req, res) => {
      try {
        const data = req.body;
        // console.log(data);
        const oDTO = {
          name: data.name,
          address: data.address,
          phone: data.phone,
          email: data.email
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
  };
};

module.exports = apiController;
