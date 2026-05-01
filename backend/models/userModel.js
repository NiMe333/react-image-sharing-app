var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

userSchema.pre("save", function (next) {
  var user = this;

  if (!user.isModified("password")) {
    return next();
  }

  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) return next(err);

    user.password = hash;
    next();
  });
});

userSchema.statics.authenticate = function (username, password, callback) {
  this.findOne({ username: username }).exec(function (err, user) {
    if (err) return callback(err);

    if (!user) {
      var error = new Error("User not found.");
      error.status = 401;
      return callback(error);
    }

    bcrypt.compare(password, user.password, function (err, result) {
      if (err) return callback(err);

      if (result === true) {
        return callback(null, user);
      } else {
        return callback(null, null);
      }
    });
  });
};

module.exports = mongoose.model("user", userSchema);
