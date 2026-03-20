const fs = require("fs");
const path = require("path");
const { sendMail } = require("../services/mail.service");
const orderService = require("../services/order.service");

const CNAME = "api.controller.js ";

const apiController = () => {
  return {
    Order: async (req, res) => {
      try {
        const data = req.body;
        console.log(data);
        const oDTO = {
          name: data.name,
          address: data.address,
          phone: data.phone,
          email: data.email
        };
        const task1 = await orderService.addAndSendmail(oDTO);
        if (!task1) {
          return new Error("Order is faileid");
          
        }
        res.json({ success: true });
      } catch (error) {
        console.log(CNAME, error.message);
        return res.status(500).json({ success: false, mess: error.message });
      }
    },
  };
};

module.exports = apiController;
