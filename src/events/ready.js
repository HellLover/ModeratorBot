const Event = require('../listeners/bases/eventBase');
const mongoose = require("mongoose");

module.exports = class extends Event {

    constructor(...args) {
        super(...args, {
            name: 'ready',
            once: true,
        });
    }

    async execute() {
        console.log(`[BOT] Connected!`);

        mongoose.connect(process.env.MONGO_URI, {
          useCreateIndex: true,
          useFindAndModify: false,
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }).then(console.log("[DATABASE] Connected!"))
    }
};
