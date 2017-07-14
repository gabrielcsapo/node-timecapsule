#!/usr/bin/env node

const program = require('commander');
const ora = require('ora');

const Timecapsule = require('../index');
const timecapsule = new Timecapsule();

program
  .version(require('../package.json').version)
  .command('server')
  .action(() => {
      timecapsule.serve(3000, () => {
          console.log('server listening on port 3000'); // eslint-disable-line
      });
  });

program
  .command('save <url>')
  .action((url) => {
    const spinner = ora(`Saving ${url}`).start();

    timecapsule.save(url, (error) => {
        if(error) return spinner.fail(error);
        spinner.succeed(`Saved ${url}`);
    });
  });

program
  .command('get <url>')
  .action((url) => {
    const spinner = ora(`get ${url}`).start();

    timecapsule.get(url, {}, (error, result) => {
        if(error) return spinner.fail(error);
        spinner.succeed(JSON.stringify(result, null, 4));
    });
  });

program.parse(process.argv);
