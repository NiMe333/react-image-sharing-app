var UserModel = require("../models/userModel.js");

/**
 * userController.js
 *
 * @description :: Server-side logic for managing users.
 */
module.exports = {
  /**
   * userController.list()
   */
  list: function (req, res) {
    UserModel.find({}, "username email", function (err, users) {
      if (err) {
        return res.status(500).json({
          message: "Error when getting user.",
          error: err,
        });
      }

      return res.json(users);
    });
  },

  /**
   * userController.show()
   */
  show: function (req, res) {
    var id = req.params.id;

    UserModel.findOne({ _id: id }, "username email", function (err, user) {
      if (err) {
        return res.status(500).json({
          message: "Error when getting user.",
          error: err,
        });
      }

      if (!user) {
        return res.status(404).json({
          message: "No such user",
        });
      }

      return res.json(user);
    });
  },

  /**
   * userController.create()
   */
  create: function (req, res) {
    var user = new UserModel({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
    });

    user.save(function (err, user) {
      if (err) {
        return res.status(500).json({
          message: "Error when creating user",
          error: err,
        });
      }

      return res.status(201).json({
        message: "User created successfully",
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    });
  },

  /**
   * userController.update()
   */
  update: function (req, res) {
    var id = req.params.id;

    UserModel.findOne({ _id: id }, function (err, user) {
      if (err) {
        return res.status(500).json({
          message: "Error when getting user",
          error: err,
        });
      }

      if (!user) {
        return res.status(404).json({
          message: "No such user",
        });
      }

      user.username = req.body.username ? req.body.username : user.username;
      user.password = req.body.password ? req.body.password : user.password;
      user.email = req.body.email ? req.body.email : user.email;

      user.save(function (err, updatedUser) {
        if (err) {
          return res.status(500).json({
            message: "Error when updating user.",
            error: err,
          });
        }

        return res.json({
          _id: updatedUser._id,
          username: updatedUser.username,
          email: updatedUser.email,
        });
      });
    });
  },

  /**
   * userController.remove()
   */
  remove: function (req, res) {
    var id = req.params.id;

    UserModel.findByIdAndRemove(id, function (err, user) {
      if (err) {
        return res.status(500).json({
          message: "Error when deleting the user.",
          error: err,
        });
      }

      return res.status(204).json();
    });
  },

  showRegister: function (req, res) {
    res.render("user/register"); // vrne html register
  },

  showLogin: function (req, res) {
    res.render("user/login"); // vrne html login
  },

  login: function (req, res, next) {
    UserModel.authenticate(
      req.body.username,
      req.body.password,
      function (err, user) {
        if (err || !user) {
          return res.status(401).json({
            message: "Wrong username or password",
          });
        }

        req.session.userId = user._id;

        return res.json({
          message: "Login successful",
          user: {
            _id: user._id,
            username: user.username,
            email: user.email,
          },
        });
      },
    );
  },

  profile: function (req, res, next) {
    if (!req.session.userId) {
      return res.status(401).json({
        message: "Not logged in",
      });
    }

    UserModel.findById(req.session.userId, "username email").exec(
      function (error, user) {
        if (error) {
          return next(error);
        }

        if (!user) {
          return res.status(404).json({
            message: "User not found",
          });
        }

        return res.json(user);
      },
    );
  },

  logout: function (req, res, next) {
    if (req.session) {
      req.session.destroy(function (err) {
        if (err) {
          return next(err);
        } else {
          //return res.redirect('/');
          return res.status(201).json({});
        }
      });
    }
  },
};
