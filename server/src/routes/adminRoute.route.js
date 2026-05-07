const express = require("express");
const router = express.Router();

const pageConfigController = require("../controller/pageConfig.controller")();
const orderAdminController = require("../controller/order.admin.controller")();
const feedbackAdminController = require("../controller/feedback.admin.controller")();
const accountAdminController = require("../controller/account.admin.controller")();
const orderModel = require("../model/order.model");
const feedbackModel = require("../model/feedback.model");
const pageConfigModel = require("../model/pageConfig.model");
// media library (/admin/media/...)
const mediaController = require("../controller/media.controller")();
const { uploadMedia } = require("../config/multer.config");

function multerUpload(upload, fieldName) {
  return (req, res, next) => {
    upload.single(fieldName)(req, res, (err) => {
      if (err) {
        const code = err.code;
        let message = err.message || "Upload không hợp lệ";
        if (code === "LIMIT_FILE_SIZE") {
          message = "File quá lớn (giới hạn xem gợi ý trên nút Upload)";
        }
        return res.status(400).json({
          success: false,
          message,
        });
      }
      next();
    });
  };
}

router.get("/media", mediaController.Index);
router.post("/media/folders", mediaController.CreateFolder);
router.delete("/media/folders/:id", mediaController.DeleteFolder);
router.get("/media/images", mediaController.ListImages);
router.delete("/media/images", mediaController.DeleteImage);
router.post(
  "/media/images/upload",
  multerUpload(uploadMedia, "image"),
  mediaController.UploadMedia,
);
router.post(
  "/media/videos/upload",
  multerUpload(uploadMedia, "video"),
  mediaController.UploadMedia,
);

// -cutomize
router.get("/page-config/customize-section", pageConfigController.CustomizeSection);
router.put("/page-config/customize-section", pageConfigController.SaveCustomizeSection);
//pageconfig
router.post("/page-config/create-update", pageConfigController.SaveAndUpdate);
router.get("/page-config", pageConfigController.Index);
//

router.get("/orders", orderAdminController.Index);
router.get("/orders/export", orderAdminController.ExportExcel);
router.patch("/orders/:id/status", orderAdminController.UpdateStatus);
router.delete("/orders/:id", orderAdminController.SoftDelete);
router.get("/feedbacks", feedbackAdminController.Index);
router.post("/feedbacks", feedbackAdminController.Create);
router.put("/feedbacks/:id", feedbackAdminController.Update);
router.delete("/feedbacks/:id", feedbackAdminController.Delete);
router.get("/accounts", accountAdminController.Index);
router.post("/accounts", accountAdminController.Create);
router.patch("/accounts/:id", accountAdminController.UpdateInfo);
router.patch("/accounts/:id/role", accountAdminController.UpdateRole);
router.patch("/accounts/:id/status", accountAdminController.UpdateStatus);

router.get("/", async (req, res) => {
  try {
    const startToday = new Date();
    startToday.setHours(0, 0, 0, 0);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setHours(0, 0, 0, 0);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const [totalOrders, todayOrders, statusRows, feedbackStats, dailyRows, pageConfig] = await Promise.all([
      orderModel.countDocuments({ isDeleted: false }),
      orderModel.countDocuments({
        isDeleted: false,
        createdAt: { $gte: startToday },
      }),
      orderModel.aggregate([
        { $match: { isDeleted: false } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      feedbackModel.aggregate([
        { $match: { isDeleted: false } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            avgStar: { $avg: "$star" },
          },
        },
      ]),
      orderModel.aggregate([
        {
          $match: {
            isDeleted: false,
            createdAt: { $gte: sevenDaysAgo },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
      ]),
      pageConfigModel.findOne({}).select("customize.gtm_id customize.fb_pixel_id").lean(),
    ]);

    const statusMap = {
      new: 0,
      processing: 0,
      completed: 0,
      cancelled: 0,
    };
    statusRows.forEach((row) => {
      if (statusMap[row._id] !== undefined) statusMap[row._id] = row.count;
    });

    const dailyMap = {};
    dailyRows.forEach((r) => {
      dailyMap[r._id] = r.count;
    });
    const dailyOrders = [];
    for (let i = 0; i < 7; i += 1) {
      const d = new Date(sevenDaysAgo);
      d.setDate(sevenDaysAgo.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      dailyOrders.push({
        label: `${d.getDate()}/${d.getMonth() + 1}`,
        count: dailyMap[key] || 0,
      });
    }

    const fb = feedbackStats[0] || { total: 0, avgStar: 0 };
    const completionRate = totalOrders ? Math.round((statusMap.completed / totalOrders) * 100) : 0;
    const pendingOrders = Number(statusMap.new || 0) + Number(statusMap.processing || 0);
    const cancelRate = totalOrders
      ? Math.round((Number(statusMap.cancelled || 0) / totalOrders) * 100)
      : 0;
    const trackingReady = Boolean(pageConfig?.customize?.gtm_id || pageConfig?.customize?.fb_pixel_id);

    return res.render("admin/dashboard", {
      stats: {
        totalOrders,
        todayOrders,
        pendingOrders,
        cancelRate,
        totalFeedbacks: fb.total || 0,
        avgRating: Number(fb.avgStar || 0).toFixed(1),
        completionRate,
        trackingReady,
        statusMap,
        dailyOrders,
      },
    });
  } catch (error) {
    console.log("admin.dashboard", error.message);
    return res.render("admin/dashboard", {
      stats: {
        totalOrders: 0,
        todayOrders: 0,
        pendingOrders: 0,
        cancelRate: 0,
        totalFeedbacks: 0,
        avgRating: "0.0",
        completionRate: 0,
        trackingReady: false,
        statusMap: { new: 0, processing: 0, completed: 0, cancelled: 0 },
        dailyOrders: [],
      },
    });
  }
});

module.exports = router;
