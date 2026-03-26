const path  = require("path");

// console.log('root_path: ',path.join(__dirname, "../../"))
const myPathConfig ={
    public: path.join(__dirname, "../../public"),
    root: path.join(__dirname, "../../"),
}
module.exports = myPathConfig;