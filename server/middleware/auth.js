const User = require('../models/user');

async function verifyToken(req, res, next) {
  const { username, authToken } = req.params;
  const user = await User.findOne({ username, authToken });
  
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
    req.user = user;
  next();
};

module.exports = verifyToken;
