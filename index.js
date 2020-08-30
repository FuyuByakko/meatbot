const { interpreter } = require('./interpreter');
const { program } = require('commander');
program.version('0.0.1')
  .command('run <file>')
  .action(async (file) => {
    console.log(`Running ${file}`);
    const script = require(`./scripts/${file}`);
    await interpreter(script);
  });
program.parse(process.argv);
process.on('unhandledRejection', console.error);