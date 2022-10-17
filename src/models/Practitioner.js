const mongoose = require('mongoose');
const slugify = require('slugify');
const uniqueSlug = require('unique-slug');

const practitionerSchema = new mongoose.Schema({
  fullname: {
    type: String,
    require: "Full name required"
  },
  slug: {
    type: String,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true
  },
  contact: {
    type: String,
    require: "contact number is required"

  },
  image_url: {
    type: String
  },
  dob: {
    type: Date,
    default: null,
    required: "DOB is required"
  },
  working_days: {
    type: Number
  },
  start_time: {
    type: String,
    require: "Start time is required"
  },
  end_time: {
    type: String,
    require: "End time is required"
  },
  address: {
    country: { type: String, default: null },
    province: { type: String, default: null },
    district: { type: String, default: null },
    localAddress: { type: String, default: null },
  },
  specializations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Specialization'
  }],
}, { timestamps: true });


// To make the slug 
practitionerSchema.pre('save', async function (next) {
  this.slug = slugify(`${this.fullname}-${uniqueSlug()}`, { lower: true });
  next();
})

module.exports = mongoose.model('Practitioner', practitionerSchema);