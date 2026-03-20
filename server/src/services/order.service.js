const orderEntity = require("../model/order.model");
const { sendMail } = require("./mail.service");

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
        from: 'Toppilife <info.kienvu.vn>',
        to: 'kienvu.dev@gmail.com', //q.giang2508@gmail.com
        subject: 'Ban co don hang moi',
        dataMail: {
          order_id: 'OD_123',
          order_name: data.name,
          order_email: data.email, //q.giang2508@gmail.com
          order_phone: data.phone,
          order_price: '650.000 đ',
          order_link: 'https://kienvu.id.vn'
        }
      }
      //send mail
      const task2 = await sendMail(payload);
      if(!task1 || !task2){
        return new Error("task sendmail or insert DB failed");
      }
      console.log(task1);
      console.log(task2);
      return true;
    } catch (error) {
      console.log(CNAME, error.message);
      return false;
    }
  }
  getAll() {}
  getById() {}
  update(data, id) {}
  delete(id) {}
}

module.exports = new OrderService(); //instance