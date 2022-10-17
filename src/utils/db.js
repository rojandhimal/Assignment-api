const mongoose = require('mongoose');

module.exports = () => {
  mongoose.connect("mongodb+srv://tegs:techtegs1998@tegs.tyh8twj.mongodb.net/?retryWrites=true&w=majority", err => {
    if (err) {
      console.log(err);
      process.exit(1);
    }
    else
      console.log('Database connected successfully')
  })
}