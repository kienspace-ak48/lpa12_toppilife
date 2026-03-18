const mongoose = require('mongoose')

const dbConnection =async ()=>{
    try {
        const connect = mongoose.connect(process.env.MONGO_URI);
        console.log('DB connection success 🟢')
        return connect;        
    } catch (error) {
        console.log('DB connection failed 🔴', error);
        process.exit(1);
    }
}

module.exports = dbConnection;