const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'homerepairsecret', {
    expiresIn: '30d',
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET || 'homerepairsecret');
};

module.exports = {
  generateToken,
  verifyToken,
};