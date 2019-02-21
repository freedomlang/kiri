const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
var dayjs = require("dayjs");

const commentSchema = new mongoose.Schema(
  {
    article: { type: String },
    created: { type: Date, default: Date.now },
    text: { type: String, default: "" },
    email: { type: String, default: ""},
    ip: { type: String, default: ''},
    status: { type: String, default: "unApproved" }
  },
  { versionKey: false }
);

commentSchema.set("toJSON", { getters: true, virtuals: true });
commentSchema.set("toObject", { getters: true, virtuals: true });
commentSchema.path("created").get(function(v) {
  return dayjs(v).format("YYYY-MM-DD HH:mm:ss");
});

module.exports = mongoose.model("comment", commentSchema);
