const pageConfigEntity = require("../model/pageConfig.model");

const CNAME = "pageconfig.service.js ";
class pageConfigService {
  constructor(parameters) {
    console.log("Initial pageconfig.service.js ");
  }
  //
  async AddAndUpdate(data) {
    try {
      const pageConfig = await pageConfigEntity.findOneAndUpdate(
        {},
        { $set: data },// chi udpate cac field dc truyen vao
        {
          // new: true,
          upsert: true,
        },
      );

      return true;
    } catch (error) {
      console.log(CNAME, error.message);
      return false;
    }
  }
  async GetOneRecord(){
    try {
        const pageConfig = await pageConfigEntity.findOne().lean();
        return pageConfig;
    } catch (error) {
        console.log(CNAME, error.message);
        return {}
    }
  }
  GetById(id) {}
  GetAll() {}
  Update(data, id) {}
  Delete(id) {}
}

module.exports = new pageConfigService();
