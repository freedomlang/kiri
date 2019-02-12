const mongoose = require("mongoose");
var dayjs = require("dayjs");

const uploadSchema = new mongoose.Schema(
  {
    originalFileName: { type: String },
    created: { type: Date, default: Date.now },
    createdBy: { type: String },
    fileName: { type: String },
    fileType: { type: String },
    permission: { type: String, default: 'everyone' },
    modified: { type: Date, default: Date.now },
    modifiedBy: { type: String },
  },
  { versionKey: false }
);

uploadSchema.set("toJSON", { getters: true, virtuals: true });
uploadSchema.set("toObject", { getters: true, virtuals: true });
uploadSchema.path("created").get(function(v) {
  return dayjs(v).format("YYYY-MM-DD hh:mm:ss");
});
uploadSchema.path("modified").get(function(v) {
  return dayjs(v).format("YYYY-MM-DD hh:mm:ss");
});
module.exports = mongoose.model("upload", uploadSchema);
