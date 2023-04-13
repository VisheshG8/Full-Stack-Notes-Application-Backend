const mongoose = require("mongoose");

const mongoURL = "mongodb://127.0.0.1:27017/V?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.8.0"

const connectToMongo = () =>{
    mongoose.connect(mongoURL , console.log("Connected to Mongo Successfully"))
}

module.exports = connectToMongo;