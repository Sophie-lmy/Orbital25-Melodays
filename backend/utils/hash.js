const bcrypt = require("bcrypt");

exports.hashPassword = (password) => {
  return bcrypt.hash(password, 10);
};

exports.comparePassword = (inputPassword, hashedPassword) => {
  return bcrypt.compare(inputPassword, hashedPassword);
};