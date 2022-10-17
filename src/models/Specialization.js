const mongoose = require('mongoose');

const specializationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'Specialization name is a required field',
    unique: [true, 'Specialization name must be unique']
  },
  description:{
    type: String
  }
}, { timestamps: true });

specializationSchema.pre('save', function (nxt) {
  this.name = this.name.toLowerCase();
  nxt();
})

module.exports = mongoose.model('Specialization', specializationSchema);