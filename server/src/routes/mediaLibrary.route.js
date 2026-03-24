const express = require("express");
const uploadImage = require("../config/uploadImage.config");
const uploadVideo = require("../config/uploadVideo.config");
const mediaLibraryController = require("../controller/mediaLibrary.controller")();

const router = express.Router();

router.get("/library", mediaLibraryController.LibraryPage);
router.get("/folders/tree", mediaLibraryController.FolderTree);
router.post("/folders", mediaLibraryController.CreateFolder);
router.put("/folders/:id", mediaLibraryController.UpdateFolder);
router.delete("/folders/:id", mediaLibraryController.DeleteFolder);

router.get("/images", mediaLibraryController.ListImages);
router.post("/images/upload", uploadImage.single("image"), mediaLibraryController.UploadImage);
router.delete("/images/:id", mediaLibraryController.DeleteImage);
router.get("/videos", mediaLibraryController.ListVideos);
router.post("/videos/upload", uploadVideo.single("video"), mediaLibraryController.UploadVideo);
router.delete("/videos/:id", mediaLibraryController.DeleteVideo);

module.exports = router;
