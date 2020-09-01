const dotenv = require('dotenv');
const { program } = require('commander');

const { createScriptRunner, endScriptRunner } = require('./lib/scriptRunner');

dotenv.config();

program.version('0.0.1')
  .command('run <file>')
  .action(async (file) => {
    console.log(`Running ${file}`);
    const script = require(`./scripts/${file}`);
    const scriptRunner = await createScriptRunner();
    await scriptRunner(script);
    await endScriptRunner();
  });
program.parse(process.argv);
process.on('unhandledRejection', console.error);