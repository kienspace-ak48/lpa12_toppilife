const CNAME = "home.controller.js ";

const homeController = () => {
  return {
    Index: (req, res) => {
      res.render("home", { data: null });
    },
  };
};

module.exports = homeController;
