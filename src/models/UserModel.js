const { model, Schema } = require("mongoose");

const userSchema = new Schema({
  user_id: { type: String, required: true },
  guild_id: { type: String, required: true },
  afk: {
    type: Object,
    default: {
      is_afk: false,
      reason: null,
    },
  },
});

module.exports = model("UserModel", userSchema);
