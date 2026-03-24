const orderEntity = require("../model/order.model");
const { sendMail } = require("./mail.service");
const XLSX = require("xlsx");

const CNAME = "order.service.js ";
class OrderService {
  constructor(parameters) {
    console.log("Initial", CNAME);
  }

  async addAndSendmail(data) {
    try {
      const order = new orderEntity(data);
      //save vao db
      const task1 = await order.save();
      const payload ={
        from: 'LPA12 - Toppilife <info.kienvu.vn>',
        to: 'kienvu.dev@gmail.com, q.giang2508@gmail.com', //q.giang2508@gmail.com
        subject: 'Bạn có đơn hàng mới từ LPA12',
        dataMail: {
          // Take values from saved DB record instead of hard-code
          order_id: String(task1._id || ""),
          order_name: task1.name || "",
          order_email: task1.email || "",
          order_phone: task1.phone || "",
          order_price: task1.price || "",
          order_link: `${process.env.APP_URL || "http://localhost:8082"}/admin/orders`,
        }
      }
      // Send mail in background so client does not wait for SMTP latency.
      sendMail(payload).catch((error) => {
        console.log(CNAME, "sendMail failed:", error.message);
      });
      if(!task1){
        return false;
      }
      console.log(task1);
      return true;
    } catch (error) {
      console.log(CNAME, error.message);
      return false;
    }
  }
  async getAll(query = {}) {
    try {
      const page = Math.max(parseInt(query.page, 10) || 1, 1);
      const limit = Math.min(Math.max(parseInt(query.limit, 10) || 10, 1), 100);
      const skip = (page - 1) * limit;
      const status = query.status || "";
      const keyword = (query.keyword || "").trim();

      // Keep old records (before isDeleted existed) visible on admin list
      const where = {
        $and: [
          { $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] },
        ],
      };
      if (status && ["new", "processing", "completed", "cancelled"].includes(status)) {
        where.$and.push({ status });
      }
      if (keyword) {
        const regex = new RegExp(keyword, "i");
        where.$and.push({ $or: [{ name: regex }, { phone: regex }, { email: regex }] });
      }

      const [items, total] = await Promise.all([
        orderEntity.find(where).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        orderEntity.countDocuments(where),
      ]);

      return {
        items,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.max(Math.ceil(total / limit), 1),
        },
      };
    } catch (error) {
      console.log(CNAME, error.message);
      return {
        items: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
      };
    }
  }
  async getById(id) {
    try {
      return await orderEntity
        .findOne({
          _id: id,
          $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
        })
        .lean();
    } catch (error) {
      console.log(CNAME, error.message);
      return null;
    }
  }
  async updateStatus(id, status) {
    try {
      if (!["new", "processing", "completed", "cancelled"].includes(status)) {
        return null;
      }
      return await orderEntity.findOneAndUpdate(
        { _id: id, $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] },
        { $set: { status } },
        { returnDocument: "after" },
      );
    } catch (error) {
      console.log(CNAME, error.message);
      return null;
    }
  }
  async softDelete(id) {
    try {
      return await orderEntity.findOneAndUpdate(
        { _id: id, $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] },
        { $set: { isDeleted: true } },
        { returnDocument: "after" },
      );
    } catch (error) {
      console.log(CNAME, error.message);
      return null;
    }
  }

  async exportOrdersToExcel(startDate, endDate) {
    try {
      const where = {
        $and: [{ $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] }],
      };

      const createdAt = {};
      if (startDate) {
        const start = new Date(startDate);
        if (!Number.isNaN(start.getTime())) {
          start.setHours(0, 0, 0, 0);
          createdAt.$gte = start;
        }
      }
      if (endDate) {
        const end = new Date(endDate);
        if (!Number.isNaN(end.getTime())) {
          end.setHours(23, 59, 59, 999);
          createdAt.$lte = end;
        }
      }
      if (Object.keys(createdAt).length > 0) {
        where.$and.push({ createdAt });
      }

      const orders = await orderEntity.find(where).sort({ createdAt: -1 }).lean();

      const rows = orders.map((item, idx) => ({
        STT: idx + 1,
        // id: String(item._id || ""),
        name: item.name || "",
        phone: item.phone || "",
        email: item.email || "",
        address: item.address || "",
        status: item.status || "new",
        createdAt: item.createdAt
          ? new Date(item.createdAt).toISOString()
          : "",
      }));

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(rows);
      XLSX.utils.book_append_sheet(workbook, worksheet, "orders");

      const fileName = `orders_${startDate || "all"}_${endDate || "all"}.xlsx`;
      const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

      return {
        success: true,
        buffer,
        fileName,
        total: orders.length,
      };
    } catch (error) {
      console.log(CNAME, error.message);
      return {
        success: false,
        buffer: null,
        fileName: "",
        total: 0,
      };
    }
  }
}

module.exports = new OrderService(); //instance