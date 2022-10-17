const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'Role name is a required field',
    unique: [true, 'Role name must be unique']
  }
}, { timestamps: true });

roleSchema.pre('save', function (nxt) {
  this.name = this.name.toLowerCase();
  nxt();
})

module.exports = mongoose.model('Role', roleSchema);