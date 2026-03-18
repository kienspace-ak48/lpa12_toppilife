const CNAME = "home.controller.js ";

const testModel = require("../model/test.model");

const homeController = () => {
  return {
    Index: (req, res) => {
      res.render("home", { data: null });
    },
    Test: async (req, res) => {
      try {
        // const test = await testModel.create({
        //   name: "ces_toppilife",
        // });
        const t = await testModel.find({}).lean();
        console.log(t)
        res.render("home", { data: null });
      } catch (error) {
        console.log(CANME, error.message);
        res.render("home", { data: null });
      }
    },
  };
};

module.exports = homeController;
