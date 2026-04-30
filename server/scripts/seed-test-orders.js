const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

const mongoose = require("mongoose");
const dbConnection = require("../src/config/dbConnection.config");
const Order = require("../src/model/order.model");

const SAMPLE_NAMES = [
  "Nguyen Van An",
  "Tran Thi Binh",
  "Le Hoang Nam",
  "Pham Minh Tuan",
  "Vu Thu Trang",
  "Dang Quoc Hung",
  "Bui Tuyet Mai",
  "Ngo Gia Bao",
  "Ly My Linh",
  "Do Anh Duc",
];

const SAMPLE_ADDRESSES = [
  "12 Nguyen Trai, Quan 1, TP.HCM",
  "45 Le Loi, Hai Chau, Da Nang",
  "88 Tran Phu, Ngo Quyen, Hai Phong",
  "102 Cach Mang Thang 8, Ninh Kieu, Can Tho",
  "7 Phan Dinh Phung, Ba Dinh, Ha Noi",
  "256 Vo Van Kiet, Quan 5, TP.HCM",
  "14 Ly Thuong Kiet, Thanh Khe, Da Nang",
  "63 Nguyen Hue, Hue City, Thua Thien Hue",
  "39 Dien Bien Phu, Quy Nhon, Binh Dinh",
  "91 Hai Ba Trung, Da Lat, Lam Dong",
];

const STATUSES = ["new", "processing", "completed", "cancelled"];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem(arr) {
  return arr[randomInt(0, arr.length - 1)];
}

function makePhone() {
  return `0${randomInt(300000000, 999999999)}`;
}

function makeEmail(name) {
  const normalized = name.toLowerCase().replace(/\s+/g, ".");
  return `${normalized}${randomInt(1, 999)}@example.com`;
}

function randomCreatedAtWithinDays(days) {
  const now = Date.now();
  const offsetMs = randomInt(0, days * 24 * 60 * 60 * 1000);
  return new Date(now - offsetMs);
}

async function run() {
  const countArg = Number(process.argv[2] || 10);
  const count = Number.isFinite(countArg) && countArg > 0 ? countArg : 10;

  await dbConnection();

  const docs = Array.from({ length: count }).map((_, i) => {
    const name = randomItem(SAMPLE_NAMES);
    const createdAt = randomCreatedAtWithinDays(21);
    return {
      name,
      phone: makePhone(),
      address: randomItem(SAMPLE_ADDRESSES),
      email: makeEmail(name),
      status: randomItem(STATUSES),
      isDeleted: false,
      createdAt,
      updatedAt: createdAt,
    };
  });

  const inserted = await Order.insertMany(docs);
  console.log(`Seeded ${inserted.length} test orders.`);
}

run()
  .catch((err) => {
    console.error("Seed failed:", err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
