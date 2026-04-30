const path = require('path');
require('dotenv').config(
    {
    path: path.resolve(__dirname, '../.env')
    }
);
const http = require('http');
const app = require('./app');
const HTTP_PORT = process.env.HTTP_PORT;
const HOST = '0.0.0.0';

const httpServer = http.createServer(app);
console.log('NODE_ENV: ',process.env.NODE_ENV)
// console.log("ENV CHECK:", process.env)
// 🚀 BOOT Server
httpServer.listen(HTTP_PORT, HOST,()=>{
    console.log(`App is running on http://localhost:${HTTP_PORT}`)
});