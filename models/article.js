const mongoose = require("mongoose");
var dayjs = require("dayjs");

const articleSchema = new mongoose.Schema(
  {
    title: { type: String }, //属性name,类型为String
    created: { type: Date, default: Date.now },
    modified: { type: Date, default: Date.now },
    accessed: { type: Date, default: Date.now },
    text: { type: String, default: "" },
    status: { type: String, default: "draft" },
    password: { type: String, default: "" },
    traffic: { type: Number, default: 0 }
  },
  { versionKey: false }
);

articleSchema.set("toJSON", { getters: true, virtuals: true });
articleSchema.set("toObject", { getters: true, virtuals: true });
articleSchema.path("created").get(function(v) {
  return dayjs(v).format("YYYY-MM-DD HH:mm:ss");
});
articleSchema.path("modified").get(function(v) {
  return dayjs(v).format("YYYY-MM-DD HH:mm:ss");
});
articleSchema.path("accessed").get(function(v) {
  return dayjs(v).format("YYYY-MM-DD HH:mm:ss");
});

module.exports = mongoose.model("article", articleSchema);
