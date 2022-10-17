const mongoose = require('mongoose');
const slugify = require('slugify');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uniqueSlug = require('unique-slug');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  slug: {
    type: String,
  },
  email: {
    type: String,
    required: [true, 'Email is a required field'],
    unique: true
  },
  phoneNumber: {
      type: String
  },
  password: {
    type: String,
    required: [true, 'Password is a required field'],
  },
  dob: {
    type: Date,
    default: null
  },
  address: {
    country: { type: String, default: null },
    province: { type: String, default: null },
    district: { type: String, default: null },
    localAddress: { type: String, default: null },
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: [true, 'Role is required']
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String,
    default: null
  },
  forgotPasswordToken: {
    type: String,
    default: null
  }
}, { timestamps: true });

// To make the slug + hashing password
userSchema.pre('save', async function (next) {
  this.slug = slugify(`${this.name}-${uniqueSlug()}`, { lower: true });

  const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUND) || 12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
})

// To make the slug
userSchema.pre('findOneAndUpdate', function (next) {
  if (this._update?.name)
    this.findOneAndUpdate({}, { $set: { slug: slugify(`${this._update.name}-${uniqueSlug()}`, { lower: true }) } });
  next();
})

// To verify user password
userSchema.methods.checkPassword = async function (password) {
  const isValidPassword = await bcrypt.compare(password, this.password);
  if (isValidPassword)
    return true;
  return false;
}

// To generate the auth
userSchema.methods.getAuthToken = function (role) {
  return jwt.sign(
    { id: this._id, name: this.name, role },
    process.env.APP_PRIVATE_KEY,
    { expiresIn: '1h' }
  )
}

// To generate the refresh token
userSchema.methods.getRefreshToken = function (role) {
  return jwt.sign(
    { id: this._id, name: this.name, role },
    process.env.APP_PRIVATE_KEY,
    { expiresIn: '12hr' }
  )
}

// To generate the email verified token
userSchema.methods.getEmailVerifiedToken = (id) => {
  return jwt.sign(
    { id },
    process.env.APP_PRIVATE_KEY,
    { expiresIn: '2h' }
  )
}

// To generate the email verified token
userSchema.methods.getForgotPasswordToken = (id) => {
  return jwt.sign(
    { id },
    process.env.APP_PRIVATE_KEY,
    { expiresIn: '2h' }
  )
}

// To generate the email verified token
userSchema.methods.getPhoneVerifyToken = (id) => {
  return jwt.sign(
    { id },
    process.env.APP_PRIVATE_KEY,
    { expiresIn: '2h' }
  )
}

// To hash the password
userSchema.methods.hashPassword = async function (password) {
  const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUND) || 12);
  return await bcrypt.hash(password, salt);
}

module.exports = mongoose.model('User', userSchema);