const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      index: {unique: true}
    },
    email_verified_at: {
      type: Date,
      default: Date.now
    },
    password: {
      type: String,
      required: true
    },
    remember_token: {
      type: String,
      required: true,
      default: null
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  { strict: true }
);

module.exports = mongoose.model("users", UserSchema);
