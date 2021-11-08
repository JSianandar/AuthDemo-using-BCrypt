const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username must be filled in"],
  },
  //   hashed password
  password: {
    type: String,
    required: [true, "Password must be filled in"],
  },
});
// function to validate password
userSchema.statics.findAndValidate = async function (username, password) {
  const foundUser = await this.findOne({ username });
  const isValid = await bcrypt.compare(password, foundUser.password);
  return isValid ? foundUser : false;
};
//Middleware for pre-saving user
userSchema.pre("save", async function (next) {
  // if the same password
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model("User", userSchema);
