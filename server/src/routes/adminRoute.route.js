const express = require("express");
const router = express.Router();

const galleryController = require("../controller/gallery.controller")();
const homeController = require('../controller/home.controller')();
const pageConfigController = require('../controller/pageConfig.controller')();
const orderAdminController = require("../controller/order.admin.controller")();
const feedbackAdminController = require("../controller/feedback.admin.controller")();
const mediaLibraryRoute = require("./mediaLibrary.route");
const uploadImage = require("../config/uploadImage.config");

// -cutomize
router.get('/page-config/customize-section', pageConfigController.CustomizeSection);
router.put('/page-config/customize-section', pageConfigController.SaveCustomizeSection);
//pageconfig
router.post('/page-config/create-update', pageConfigController.SaveAndUpdate);
router.get('/page-config', pageConfigController.Index);
//

//
router.delete("/gallery/image-delete", galleryController.DeleteImage);
router.get('/gallery/image-getall', galleryController.GetAll);
router.get("/gallery", galleryController.Index);
// ======== folder
router.post('/gallery/folder/create', galleryController.CreateFolder);
router.delete('/gallery/folder-delete', galleryController.DeleteFolder);
//===========category
router.post('/gallery/category/create', galleryController.CreateFolder);
router.get('/gallery/category/get-all', galleryController.GetAllFolder);
router.get('/gallery/images', galleryController.GetAllImageByFolder);
router.post('/gallery/image-upload-ajax',uploadImage.single("image"),
(req, res, next) => {
  // console.log("REQ.FILE =", req.file);
  next();
},galleryController.UploadImage);
router.delete('/gallery/image-delete-ajax', galleryController.DeleteImageAjax);
router.use("/media", mediaLibraryRoute);

router.get("/orders", orderAdminController.Index);
router.get("/orders/export", orderAdminController.ExportExcel);
router.patch("/orders/:id/status", orderAdminController.UpdateStatus);
router.delete("/orders/:id", orderAdminController.SoftDelete);
router.get("/feedbacks", feedbackAdminController.Index);
router.post("/feedbacks", feedbackAdminController.Create);
router.put("/feedbacks/:id", feedbackAdminController.Update);
router.delete("/feedbacks/:id", feedbackAdminController.Delete);

router.get("/", async (req, res) => {

  res.render("admin/dashboard");
});

module.exports = router;
