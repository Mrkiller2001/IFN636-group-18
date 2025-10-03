const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  // Normalize header and extract token
  const authHeader = req.headers.authorization || '';
  if (!authHeader.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) {
      return res.status(401).json({ message: 'Not authorized, invalid token' });
    }

    // Load user (without password) – controllers rely on req.user.id
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    req.user = user; // Mongoose adds a virtual string `id`, so req.user.id is safe
    return next();
  } catch (err) {
    if (err?.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Not authorized, token expired' });
    }
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = { protect };
