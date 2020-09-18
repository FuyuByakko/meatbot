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
    const result = await scriptRunner(script);
    if (result && result.size && result.size() > 0) {
      console.log('\nSTORAGE CONTENT:')
      const printData = (key, value) => { console.log(`* ${key}: ${value}`)};
      result.each(printData);
    }
    await endScriptRunner();
  });

program.parse(process.argv);
process.on('unhandledRejection', async (e) => {
  console.error(e);
  try {
    await endScriptRunner();
  } catch (error) {
    console.error(error);
  }
});
