const mongoose = require("mongoose");

const mongoURL = "mongodb+srv://guptavishesh2:V123456789@e-notes.2hedvub.mongodb.net/notesApplication"

const connectToMongo = () =>{
    mongoose.connect(mongoURL , console.log("Connected to Mongo Successfully"))
}

module.exports = connectToMongo;