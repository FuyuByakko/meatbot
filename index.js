const dotenv = require('dotenv');
const { program } = require('commander');
const { createScriptRunner, endScriptRunner } = require('./lib/scriptRunner');
const { getScript } = require('./lib/readScript');
const { saveScriptToS3, getScriptFromS3 } = require('./lib/aws');

dotenv.config();

program.version('0.0.1')
  .command('run <file> [options...]')
  .action(async (file, options) => {
    
    console.log(`Running ${file}`);
    //TODO: add option for --S3
    const fromS3 = options.includes('S3') || options.includes('s3');
    const script = await getScript(file, fromS3);

    const nonHeadless = options.includes('non-headless');
    if (nonHeadless) {
      process.env.BROWSER_HEADLESS = false;
    }
    
    const scriptRunner = await createScriptRunner();
    const result = await scriptRunner(script);
    if (result && result.size && result.size() > 0) {
      console.log('\nSTORAGE CONTENT:')
      const printData = (key, value) => { console.log(`* ${key}: ${value}`)};
      result.each(printData);
    }
    await endScriptRunner();
  });
  
  program.version('0.0.2')
  .command('scripts <subcommand> <file>')
  .action(async (subcommand, file) => {
    switch(subcommand) {
      case 'upload':
      case 'U':
        console.log(`Uploading ${file}`);
        await saveScriptToS3(file);
        break;
      case 'download':
      case 'D':
        console.log(`Downloading ${file}`);
        await getScriptFromS3(file);
        break;
      default:
        console.error('Invalid command! Use D/download or U/upload');
    }
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
