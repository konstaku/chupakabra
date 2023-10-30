require('dotenv').config();

const mongoose = require('mongoose');
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const uri = `mongodb+srv://0864380:${MONGO_PASSWORD}@piglets.vfyjg2w.mongodb.net/`;

module.exports.runDB = async function () {
  await mongoose.connect(uri);
  console.log('Database connected');
};
