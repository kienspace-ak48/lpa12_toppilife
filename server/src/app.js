const express = require("express");
const myPathConfig = require("./config/myPath.config");
const app = express();
const fs = require("fs");
const cors = require('cors');
const expressLayouts = require('express-ejs-layouts');
const response  = require("./middlewares/response.middleware");
const router = require('./routes');
const path = require('path');
const dbConnection = require("./config/dbConnection.config");
const pageConfigModel = require("./model/pageConfig.model");
const feedbackModel = require("./model/feedback.model");
const cookieParser = require("cookie-parser");

//connect dB
dbConnection();
//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

//view engine EJS
app.set('view engine', 'ejs');
app.set('views', path.join(myPathConfig.root, 'src/views'));
// +layout
app.use(expressLayouts);
app.set('layout', 'layout/main');//file layout default

//
app.use(cors())
// serve static React
app.use(express.static(myPathConfig.public));
app.use(response);

// router
router(app);

//test area
app.get("/test", (req, res) => {
  res.json({ success: true, mess: "hello world" });
});
app.get('/api/landing', async(req, res)=>{
  try {
    const pc = await pageConfigModel.findOne({}).select('-__v -_id').lean();
    const feedbackItems = await feedbackModel
      .find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .select("-__v")
      .lean();
    pc.feedback = pc.feedback || {};
    pc.feedback.items = feedbackItems;
    // console.log(pc);
    res.success(pc)
  } catch (error) {
    console.error('loi entry point')
  }
})
// const html = fs.readFile(myPathConfig.public+"index.html");
// console.log(html);
app.use(async (req, res) => {
  res.sendFile(myPathConfig.public + "/index.html");
});
//end

module.exports = app;
