const { User, Role } = require('../models');

// TO REGISTER USER
module.exports.apiRegisterUser = async (req, res) => {
  let role = await Role.findOne({ name: 'user' });
  if (!role)
    role = await Role.create({ name: 'user' });
  req.body.role = role._id;

  // Check if the user sends veify-email
  if (req.body.emailVerified)
    delete req.body.emailVerified;
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({ status: false, msg: `Email: ${req.body.email} already registered.` });
    } else {
      User.create(req.body).then((user) => {
        if (user) {
          delete user["password"];
          return res.status(201).json({ status: false, user, msg: "User signup successfully" });
        } else {
          return res.status(400).json({ status: false, msg: error?.message });
        }
      }).catch((error) => {
        return res.status(400).json({ status: false, msg: error?.message });
      })
    }
  })
    .catch((error) => {
      return res.status(400).json({ status: false, msg: error?.message });
    })

}

// TO LOGIN USER
module.exports.apiLoginUser = async (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }).populate('role').then(async (user) => {
    if (user) {
      const isPasswordValid = await user.checkPassword(password || `${Math.random()}`);
      if (isPasswordValid) {
        const authToken = user.getAuthToken(user.role.name);
        const refreshToken = user.getRefreshToken(user.role.name);
        return res.json({ status: true, user, authToken, refreshToken, msg: 'Login successful' });
      }
      return res.status(400).json({ status: false, msg: "Wrong password. Try again or click Forgot Password to reset it" })
    }
    return res.status(400).json({ status: true, msg: "Couldn't find your email/phonenumber, please register first" });
  }).catch((error) => {
    return res.status(400).json({ status: true, msg: error?.message });
  })
}

// To get new access and refresh token from refresh token
module.exports.apiGetRefreshToken = async (req, res) => {
  const user = await User.findById(req.user.id).populate('role', 'name');
  if (user) {
    const authToken = user.getAuthToken(user.role.name);
    const refreshToken = user.getRefreshToken(user.role.name);
    return res.json({ status: true, authToken, refreshToken });
  }
  return res.status(400).json({ status: false, msg: 'Please Login' });
}