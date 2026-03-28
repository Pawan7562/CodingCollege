// Auth controller
const register = (req, res) => {
  res.json({ success: true, message: 'Register endpoint' });
};

const login = (req, res) => {
  res.json({ success: true, message: 'Login endpoint' });
};

const getMe = (req, res) => {
  res.json({ success: true, message: 'Get me endpoint' });
};

module.exports = {
  register,
  login,
  getMe
};
