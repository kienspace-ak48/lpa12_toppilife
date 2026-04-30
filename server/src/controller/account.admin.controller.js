const bcrypt = require("bcrypt");
const userModel = require("../model/user.model");

const CNAME = "account.admin.controller.js ";
const VNAME = "admin/";
const ALLOWED_ROLES = ["admin", "super_admin"];

const accountAdminController = () => {
  return {
    Index: async (req, res) => {
      try {
        const users = await userModel
          .find({})
          .select("_id name username email phone status role createdAt")
          .sort({ createdAt: -1 })
          .lean();
        return res.render(VNAME + "accounts", {
          users,
          canManageRoles: req.user?.role === "super_admin",
        });
      } catch (error) {
        console.log(CNAME, error.message);
        return res.render(VNAME + "accounts", { users: [], canManageRoles: false });
      }
    },
    Create: async (req, res) => {
      try {
        if (req.user?.role !== "super_admin") {
          return res.status(403).json({ success: false, mess: "Forbidden" });
        }
        const name = String(req.body.name || "").trim();
        const username = String(req.body.username || "").trim();
        const email = String(req.body.email || "").trim().toLowerCase();
        const phone = String(req.body.phone || "").trim();
        const password = String(req.body.password || "");
        const role = ALLOWED_ROLES.includes(req.body.role) ? req.body.role : "admin";
        if (!name || !username || !email || !password) {
          return res.status(400).json({ success: false, mess: "Thiếu thông tin bắt buộc." });
        }
        const existed = await userModel.findOne({
          $or: [{ email }, { username }],
        });
        if (existed) {
          return res.status(409).json({ success: false, mess: "Email hoặc username đã tồn tại." });
        }
        const hashed = await bcrypt.hash(password, 10);
        await userModel.create({
          name,
          username,
          email,
          phone,
          password: hashed,
          role,
          status: true,
        });
        return res.json({ success: true });
      } catch (error) {
        console.log(CNAME, error.message);
        return res.status(500).json({ success: false, mess: error.message });
      }
    },
    UpdateInfo: async (req, res) => {
      try {
        if (req.user?.role !== "super_admin") {
          return res.status(403).json({ success: false, mess: "Forbidden" });
        }
        const id = String(req.params.id || "");
        const name = String(req.body.name || "").trim();
        const username = String(req.body.username || "").trim();
        const email = String(req.body.email || "").trim().toLowerCase();
        const phone = String(req.body.phone || "").trim();
        const newPassword = String(req.body.password || "");

        if (!name || !username || !email) {
          return res.status(400).json({ success: false, mess: "Thiếu thông tin bắt buộc." });
        }
        const existed = await userModel.findOne({
          _id: { $ne: id },
          $or: [{ email }, { username }],
        });
        if (existed) {
          return res.status(409).json({ success: false, mess: "Email hoặc username đã tồn tại." });
        }
        const updateSet = {
          name,
          username,
          email,
          phone,
        };
        if (newPassword) {
          updateSet.password = await bcrypt.hash(newPassword, 10);
        }

        const updated = await userModel.findByIdAndUpdate(
          id,
          { $set: updateSet },
          { returnDocument: "after" },
        );
        if (!updated) {
          return res.status(404).json({ success: false, mess: "Không tìm thấy account." });
        }
        return res.json({ success: true });
      } catch (error) {
        console.log(CNAME, error.message);
        return res.status(500).json({ success: false, mess: error.message });
      }
    },
    UpdateRole: async (req, res) => {
      try {
        if (req.user?.role !== "super_admin") {
          return res.status(403).json({ success: false, mess: "Forbidden" });
        }
        const role = String(req.body.role || "");
        if (!ALLOWED_ROLES.includes(role)) {
          return res.status(400).json({ success: false, mess: "Role không hợp lệ." });
        }
        if (String(req.user?._id) === String(req.params.id) && role !== "super_admin") {
          return res.status(400).json({ success: false, mess: "Không thể tự hạ quyền." });
        }
        const updated = await userModel.findByIdAndUpdate(
          req.params.id,
          { $set: { role } },
          { returnDocument: "after" },
        );
        if (!updated) {
          return res.status(404).json({ success: false, mess: "Không tìm thấy account." });
        }
        return res.json({ success: true });
      } catch (error) {
        console.log(CNAME, error.message);
        return res.status(500).json({ success: false, mess: error.message });
      }
    },
    UpdateStatus: async (req, res) => {
      try {
        if (req.user?.role !== "super_admin") {
          return res.status(403).json({ success: false, mess: "Forbidden" });
        }
        const status = Boolean(req.body.status);
        if (String(req.user?._id) === String(req.params.id) && !status) {
          return res.status(400).json({ success: false, mess: "Không thể tự khóa account." });
        }
        const updated = await userModel.findByIdAndUpdate(
          req.params.id,
          { $set: { status } },
          { returnDocument: "after" },
        );
        if (!updated) {
          return res.status(404).json({ success: false, mess: "Không tìm thấy account." });
        }
        return res.json({ success: true });
      } catch (error) {
        console.log(CNAME, error.message);
        return res.status(500).json({ success: false, mess: error.message });
      }
    },
  };
};

module.exports = accountAdminController;
