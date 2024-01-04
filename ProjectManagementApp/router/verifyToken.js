const jwt = require('jsonwebtoken');

// Middleware function to verify the JWT token from the Authorization header
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
 // console.log("sdhcjh");
  const token = authHeader && authHeader.split(' ')[1]; // Get the token from the Authorization header
  console.log(token);

  if (!token) {
    console.log("No token");
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, 'Ankur', (err, decodedToken) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = decodedToken; // Set the decoded token data in the request object
    next(); // Move to the next middleware or route handler
  });
};

module.exports = verifyToken;
