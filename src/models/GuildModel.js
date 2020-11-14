const { model, Schema } = require("mongoose");

const guildSchema = new Schema({
  guild_id: { type: String, required: true },
  prefix: { type: String, default: ";" },
  blacklistedwords: { type: Array, default: [] },
  custom_commands: { type: Array, default: [] },
});

module.exports = model("GuildModel", guildSchema);
