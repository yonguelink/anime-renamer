const yargs = require('yargs');
const fs = require('fs-extra');
const path = require('path');
const LOG_FILE = path.join(__dirname, 'errors.log');

async function runCommand (fn, ...args) {
  try {
    await fn(...args);
  } catch (err) {
    const msg = `${new Date()}: ${err}\n`;
    await fs.appendFile(LOG_FILE, msg);
    console.error(err.stack);
    process.exit(1);
  }
}

yargs
  .command({
    command: 'rename-all',
    desc: 'Rename all the animes found in given folder',
    builder: yargs => yargs
      .option('dir', {
        descrition: 'Folder to rename the animes in',
        type: 'string',
        default: 'C:\\Users\\Isaac\\Downloads'
      }),
    handler ({dir}) {
      runCommand(require('./anime'), dir);
    }
  })
  .strict()
  .demandCommand(1)
  .version()
  .help()
  .parse();
