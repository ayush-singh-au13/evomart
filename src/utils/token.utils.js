const jwt = require("jsonwebtoken");

exports.createJwtToken = (payload) => {
  const token = jwt.sign(payload, process.env.SECRET, { expiresIn: 86400 });
  return token;
};

exports.verifyJwtToken = async (req, res, token) => {
  try {
    let { userId } = jwt.verify(token, process.env.SECRET);
    return userId;
  } catch (e) {
    throw new Error(e);
  }
};
