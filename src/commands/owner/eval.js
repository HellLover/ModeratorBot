const Command = require('../../listeners/bases/commandBase');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'eval',
            description: 'Evaluate a JavaScript code!',
            category: 'Owner',
            ownerOnly: true,
            aliases: ["ev"]
        });
    }

    async execute(message, args) {

      const toEval = args.join(" ");

  try {

    let evaled = await eval(toEval);
    const eevaled = typeof evaled;
    evaled = require("util").inspect(evaled, {
      depth: 0,
      maxArrayLength: null,
    });
    const type = eevaled[0].toUpperCase() + eevaled.slice(1);

    message.channel.send(`Typeof: \`${type}\`\n\`\`\`javascript\n${evaled}\n\`\`\``);
  } catch (error) {
    message.channel.send(`An error occured\n\`\`\`javascript\n${error}\n\`\`\``);
      }
    }
};
