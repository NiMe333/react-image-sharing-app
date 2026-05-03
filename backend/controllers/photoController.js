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
    PhotoModel.find({ hidden: false })
      .sort({ createdAt: -1 })
      .populate("postedBy", "username email")
      .exec(function (err, photos) {
        if (err) {
          return res.status(500).json({
            message: "Error when getting photo.",
            error: err,
          });
        }
        return res.json(photos);
      });
  },

  /**
   * photoController.show()
   */
  show: function (req, res) {
    var id = req.params.id;

    PhotoModel.findOne({ _id: id, hidden: false })
      .populate("postedBy", "username email")
      .populate("comments.user", "username email")
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

        photo.views += 1;
        photo.save();

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
      .populate("postedBy", "username email")
      .populate("comments.user", "username email")
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

        if (photo.postedBy.toString() !== req.session.userId) {
          return res.status(403).json({ message: "Forbidden" });
        }

        photo.name = req.body.name ? req.body.name : photo.name;
        photo.message = req.body.message ? req.body.message : photo.message;

        photo.save(function (err, updatedPhoto) {
          if (err) {
            return res.status(500).json({
              message: "Error when updating photo.",
              error: err,
            });
          }

          return res.json(updatedPhoto);
        });
      });
  },

  /**
   * photoController.remove()
   */
  remove: function (req, res) {
    var id = req.params.id;

    PhotoModel.findById(id, function (err, photo) {
      if (err) {
        return res.status(500).json({
          message: "Error when getting the photo.",
          error: err,
        });
      }

      if (!photo) {
        return res.status(404).json({
          message: "No such photo",
        });
      }

      if (!req.session.userId) {
        return res.status(401).json({
          message: "Login required",
        });
      }

      if (photo.postedBy.toString() !== req.session.userId) {
        return res.status(403).json({
          message: "Only author can delete this photo",
        });
      }

      // DELETE
      PhotoModel.findByIdAndRemove(id, function (err) {
        if (err) {
          return res.status(500).json({
            message: "Error when deleting the photo.",
            error: err,
          });
        }

        return res.status(204).json();
      });
    });
  },

  /**
   * photoController.publish()
   */
  publish: function (req, res) {
    return res.render("photo/publish");
  },

  /**
   * photoController.like()
   */
  like: async function (req, res) {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Login required" });
    }

    const userId = req.session.userId;
    const photo = await PhotoModel.findById(req.params.id);

    if (!photo) return res.status(404).json({ message: "Not found" });

    const hasLiked = photo.likedBy.includes(userId); // ali je uporabnik že lajkal
    const hasDisliked = photo.dislikedBy.includes(userId);

    // Če je že likal se like odstrani
    if (hasLiked) {
      photo.likedBy = photo.likedBy.filter((id) => id.toString() !== userId);
      photo.likes -= 1;
    }
    // Zamenja DISLIKE → LIKE
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

    // Če je DISLIKE
    if (hasDisliked) {
      photo.dislikedBy = photo.dislikedBy.filter(
        (id) => id.toString() !== userId,
      );
      photo.dislikes -= 1;
    }
    // Zamenja LIKE → DISLIKE
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
    if (!req.session.userId) {
      return res.status(401).json({ message: "Login required" });
    }

    if (!req.body.text) {
      return res.status(400).json({ message: "Comment required" });
    }

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

  trending: async function (req, res) {
    try {
      const photos = await PhotoModel.find({ hidden: false })
        .populate("postedBy", "username email")
        .populate("comments.user", "username email");

      const now = new Date();

      const rankedPhotos = photos.map(function (photo) {
        const votes = photo.likes - photo.dislikes;
        const ageInHours = (now - new Date(photo.createdAt)) / (1000 * 60 * 60);
        const score = votes / Math.pow(ageInHours + 2, 1.5);

        return {
          ...photo.toObject(),
          score: score,
        };
      });

      rankedPhotos.sort(function (a, b) {
        return b.score - a.score;
      });

      return res.json(rankedPhotos);
    } catch (err) {
      return res.status(500).json({
        message: "Error when getting trending photos",
        error: err,
      });
    }
  },

  // REPORT (neprimerna vsebina)
  report: async function (req, res) {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Login required" });
    }

    try {
      const userId = req.session.userId;
      const photo = await PhotoModel.findById(req.params.id);

      if (!photo) {
        return res.status(404).json({ message: "Photo not found" });
      }

      const alreadyReported = photo.reportedBy.some(
        (id) => id.toString() === userId,
      );

      if (alreadyReported) {
        return res.status(400).json({
          message: "Already reported",
        });
      }

      photo.reportedBy.push(userId);
      photo.reports += 1;

      // pogoj kdaj postane hidden
      if (photo.reports >= 3) {
        photo.hidden = true;
      }

      await photo.save();

      return res.json({
        message: "Reported successfully",
        reports: photo.reports,
        hidden: photo.hidden,
      });
    } catch (err) {
      return res.status(500).json({
        message: "Error reporting photo",
        error: err,
      });
    }
  },
};
