const mongoose = require('mongoose');

module.exports = () => {
  mongoose.connect(process.env.MONGO_DB, err => {
    if (err) {
      console.log(err);
      process.exit(1);
    }
    else
      console.log('Database connected successfully')
  })
}