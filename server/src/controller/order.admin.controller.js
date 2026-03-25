const orderService = require("../services/order.service");

const CNAME = "order.admin.controller.js ";
const VNAME = "admin/";

const orderAdminController = () => {
  return {
    Index: async (req, res) => {
      try {
        const status = (req.query.status || "").trim();
        const keyword = (req.query.keyword || "").trim();
        const startDate = (req.query.startDate || "").trim();
        const endDate = (req.query.endDate || "").trim();
        const orderId = (req.query.orderId || "").trim();
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const data = await orderService.getAll({ status, keyword, page, limit });

        return res.render(VNAME + "orders", {
          orders: data.items,
          filter: { status, keyword, startDate, endDate },
          pagination: data.pagination,
          statuses: ["new", "processing", "completed", "cancelled"],
          highlightOrderId: orderId,
        });
      } catch (error) {
        console.log(CNAME, error.message);
        return res.render(VNAME + "orders", {
          orders: [],
          filter: { status: "", keyword: "", startDate: "", endDate: "" },
          pagination: { page: 1, totalPages: 1, total: 0, limit: 10 },
          statuses: ["new", "processing", "completed", "cancelled"],
          highlightOrderId: "",
        });
      }
    },
    ExportExcel: async (req, res) => {
      try {
        const startDate = (req.query.startDate || "").trim();
        const endDate = (req.query.endDate || "").trim();
        const exported = await orderService.exportOrdersToExcel(startDate, endDate);
        if (!exported.success || !exported.buffer) {
          return res.status(500).json({ success: false, mess: "Export failed" });
        }

        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        );
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${exported.fileName}"`,
        );
        return res.send(exported.buffer);
      } catch (error) {
        console.log(CNAME, error.message);
        return res.status(500).json({ success: false, mess: error.message });
      }
    },
    UpdateStatus: async (req, res) => {
      try {
        const { id } = req.params;
        const { status } = req.body;
        const updated = await orderService.updateStatus(id, status);
        if (!updated) {
          return res.status(400).json({ success: false, mess: "Update status failed" });
        }
        return res.json({ success: true, data: updated });
      } catch (error) {
        console.log(CNAME, error.message);
        return res.status(500).json({ success: false, mess: error.message });
      }
    },
    SoftDelete: async (req, res) => {
      try {
        const { id } = req.params;
        const deleted = await orderService.softDelete(id);
        if (!deleted) {
          return res.status(400).json({ success: false, mess: "Delete order failed" });
        }
        return res.json({ success: true });
      } catch (error) {
        console.log(CNAME, error.message);
        return res.status(500).json({ success: false, mess: error.message });
      }
    },
  };
};

module.exports = orderAdminController;
