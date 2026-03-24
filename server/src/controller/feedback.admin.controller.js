const feedbackModel = require("../model/feedback.model");

const CNAME = "feedback.admin.controller.js ";
const VNAME = "admin/";

const normalizePayload = (body) => {
  const images = Array.isArray(body.images)
    ? body.images
    : String(body.images || "")
        .split("\n")
        .map((i) => i.trim())
        .filter(Boolean);

  return {
    customer_name: String(body.customer_name || "").trim(),
    star: Number(body.star || 5),
    comment: String(body.comment || "").trim(),
    avatar_url: String(body.avatar_url || "").trim(),
    images: images.slice(0, 2),
    video_url: String(body.video_url || "").trim(),
  };
};

const feedbackAdminController = () => {
  return {
    Index: async (req, res) => {
      try {
        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
        const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 50);
        const skip = (page - 1) * limit;

        const [feedbacks, total] = await Promise.all([
          feedbackModel
            .find({ isDeleted: false })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
          feedbackModel.countDocuments({ isDeleted: false }),
        ]);

        return res.render(VNAME + "feedbacks", {
          feedbacks,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.max(Math.ceil(total / limit), 1),
          },
        });
      } catch (error) {
        console.log(CNAME, error.message);
        return res.render(VNAME + "feedbacks", {
          feedbacks: [],
          pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
        });
      }
    },
    Create: async (req, res) => {
      try {
        const payload = normalizePayload(req.body);
        const created = await feedbackModel.create(payload);
        return res.json({ success: true, data: created });
      } catch (error) {
        console.log(CNAME, error.message);
        return res.status(500).json({ success: false, mess: error.message });
      }
    },
    Update: async (req, res) => {
      try {
        const payload = normalizePayload(req.body);
        const updated = await feedbackModel.findOneAndUpdate(
          { _id: req.params.id, isDeleted: false },
          { $set: payload },
          { returnDocument: "after" },
        );
        if (!updated) {
          return res.status(404).json({ success: false, mess: "Feedback not found" });
        }
        return res.json({ success: true, data: updated });
      } catch (error) {
        console.log(CNAME, error.message);
        return res.status(500).json({ success: false, mess: error.message });
      }
    },
    Delete: async (req, res) => {
      try {
        const deleted = await feedbackModel.findOneAndUpdate(
          { _id: req.params.id, isDeleted: false },
          { $set: { isDeleted: true } },
          { returnDocument: "after" },
        );
        if (!deleted) {
          return res.status(404).json({ success: false, mess: "Feedback not found" });
        }
        return res.json({ success: true });
      } catch (error) {
        console.log(CNAME, error.message);
        return res.status(500).json({ success: false, mess: error.message });
      }
    },
  };
};

module.exports = feedbackAdminController;
