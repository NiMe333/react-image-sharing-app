var PhotoModel = require("../models/photoModel.js");

/**
 * photoController.js
 *
 * @description :: Server-side logic for managing photos.
 */
module.exports = {
  /**
   * photoController.list()
   */
  list: function (req, res) {
    PhotoModel.find()
      .sort({ createdAt: -1 })
      .populate("postedBy")
      .exec(function (err, photos) {
        if (err) {
          return res.status(500).json({
            message: "Error when getting photo.",
            error: err,
          });
        }
        var data = [];
        data.photos = photos;
        //return res.render('photo/list', data);
        return res.json(photos);
      });
  },

  /**
   * photoController.show()
   */
  show: function (req, res) {
    var id = req.params.id;

    PhotoModel.findOne({ _id: id })
      .populate("postedBy")
      .populate("comments.user")
      .exec(function (err, photo) {
        if (err) {
          return res.status(500).json({
            message: "Error when getting photo.",
            error: err,
          });
        }

        if (!photo) {
          return res.status(404).json({
            message: "No such photo",
          });
        }

        return res.json(photo);
      });
  },

  /**
   * photoController.create()
   */
  create: function (req, res) {
    if (!req.file) {
      return res.status(400).json({
        message: "Image file is required",
      });
    }

    var photo = new PhotoModel({
      name: req.body.name,
      message: req.body.message,
      path: "/images/" + req.file.filename,
      postedBy: req.session.userId,
    });

    photo.save(function (err, photo) {
      if (err) {
        return res.status(500).json({
          message: "Error when creating photo",
          error: err,
        });
      }

      return res.status(201).json(photo);
    });
  },

  /**
   * photoController.update()
   */
  update: function (req, res) {
    var id = req.params.id;

    PhotoModel.findOne({ _id: id })
      .populate("postedBy")
      .populate("comments.user")
      .exec(function (err, photo) {
        if (err) {
          return res.status(500).json({
            message: "Error when getting photo",
            error: err,
          });
        }

        if (!photo) {
          return res.status(404).json({
            message: "No such photo",
          });
        }

        photo.name = req.body.name ? req.body.name : photo.name;
        photo.path = req.body.path ? req.body.path : photo.path;
        photo.postedBy = req.body.postedBy ? req.body.postedBy : photo.postedBy;
        photo.views = req.body.views ? req.body.views : photo.views;
        photo.likes = req.body.likes ? req.body.likes : photo.likes;

        photo.save(function (err, photo) {
          if (err) {
            return res.status(500).json({
              message: "Error when updating photo.",
              error: err,
            });
          }

          return res.json(photo);
        });
      });
  },

  /**
   * photoController.remove()
   */
  remove: function (req, res) {
    var id = req.params.id;

    PhotoModel.findByIdAndRemove(id, function (err, photo) {
      if (err) {
        return res.status(500).json({
          message: "Error when deleting the photo.",
          error: err,
        });
      }

      return res.status(204).json();
    });
  },

  publish: function (req, res) {
    return res.render("photo/publish");
  },

  like: async function (req, res) {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Login required" });
    }

    const userId = req.session.userId;

    const photo = await PhotoModel.findById(req.params.id);

    if (!photo) return res.status(404).json({ message: "Not found" });

    const hasLiked = photo.likedBy.includes(userId);
    const hasDisliked = photo.dislikedBy.includes(userId);

    // TOGGLE OFF LIKE
    if (hasLiked) {
      photo.likedBy = photo.likedBy.filter((id) => id.toString() !== userId);
      photo.likes -= 1;
    }
    // SWITCH FROM DISLIKE → LIKE
    else {
      photo.likedBy.push(userId);
      photo.likes += 1;

      if (hasDisliked) {
        photo.dislikedBy = photo.dislikedBy.filter(
          (id) => id.toString() !== userId,
        );
        photo.dislikes -= 1;
      }
    }

    await photo.save();
    return res.json(photo);
  },

  dislike: async function (req, res) {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Login required" });
    }

    const userId = req.session.userId;

    const photo = await PhotoModel.findById(req.params.id);

    if (!photo) return res.status(404).json({ message: "Not found" });

    const hasDisliked = photo.dislikedBy.includes(userId);
    const hasLiked = photo.likedBy.includes(userId);

    // TOGGLE OFF DISLIKE
    if (hasDisliked) {
      photo.dislikedBy = photo.dislikedBy.filter(
        (id) => id.toString() !== userId,
      );
      photo.dislikes -= 1;
    }
    // SWITCH FROM LIKE → DISLIKE
    else {
      photo.dislikedBy.push(userId);
      photo.dislikes += 1;

      if (hasLiked) {
        photo.likedBy = photo.likedBy.filter((id) => id.toString() !== userId);
        photo.likes -= 1;
      }
    }

    await photo.save();
    return res.json(photo);
  },

  addComment: function (req, res) {
    PhotoModel.findById(req.params.id, function (err, photo) {
      if (err || !photo) {
        return res.status(404).json({ message: "Photo not found" });
      }

      const comment = {
        text: req.body.text,
        user: req.session.userId,
      };

      photo.comments.push(comment);

      photo.save(function (err, updated) {
        return res.json(updated);
      });
    });
  },
};
