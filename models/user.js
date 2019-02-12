const mongoose = require("mongoose");
var dayjs = require("dayjs");

const userSchema = new mongoose.Schema(
  {
    username: { type: String },
    password: { type: String },
    created: { type: Date, default: Date.now },
    modified: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

userSchema.set("toJSON", { getters: true, virtuals: true });
userSchema.set("toObject", { getters: true, virtuals: true });
userSchema.path("created").get(function(v) {
  return dayjs(v).format("YYYY-MM-DD HH:mm:ss");
});
userSchema.path("modified").get(function(v) {
  return dayjs(v).format("YYYY-MM-DD HH:mm:ss");
});
module.exports = mongoose.model("user", userSchema);
