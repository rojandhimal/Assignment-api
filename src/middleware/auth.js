const jwt = require('jsonwebtoken');
const { TokenExpiredError } = require('jsonwebtoken');

// For authenticating the request user
module.exports.authentication = (req, res, next) => {
  const bearerToken = req.header('Authorization') || req.header('RefreshToken');
  if (!bearerToken)
    return res.status(403).json({ status: false, message: 'Unauthorized/Token not valid', });

  try {
    const token = bearerToken.split(" ");
    if (token[1]) {
      req.user = jwt.verify(token[1], process.env.APP_PRIVATE_KEY);
      return next();
    }
    return res.status(403).json({ status: false, message: 'Token required' });
  }
  catch (err) {
    if (err instanceof TokenExpiredError)
      return res.status(401).json({ status: false, message: 'Token Expired' });
    return res.status(403).json({ status: false, message: 'Token not valid' });
  }
}