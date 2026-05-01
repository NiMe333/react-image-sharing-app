var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var photoSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      default: "",
    },
    path: {
      type: String,
      required: true,
    },
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    dislikes: {
      type: Number,
      default: 0,
    },
    likedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    dislikedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],

    reports: {
      type: Number,
      default: 0,
    },
    reportedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    hidden: {
      type: Boolean,
      default: false,
    },
    comments: [
      {
        text: {
          type: String,
          required: true,
        },
        user: {
          type: Schema.Types.ObjectId,
          ref: "user",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("photo", photoSchema);
