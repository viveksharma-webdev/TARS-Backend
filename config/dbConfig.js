const mongoose = require('mongoose');
require('dotenv').config();
async function dbConnect(){
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('connected to database');
        return mongoose.connection
    } catch (error) {
        console.log('error in connecting to database');
        process.exit(1);
    }
};

module.exports = dbConnect;