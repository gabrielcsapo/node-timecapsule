#!/usr/bin/env node

const program = require('commander');
const Timecapsule = require('../index');
const timecapsule = new Timecapsule();

program
  .version(require('../package.json').version)
  .command('server')
  .action(() => {
      timecapsule.serve(3000, () => {
          console.log('server listening on port 3000');
      });
  })

program
  .command('save <url>')
  .action((url) => {
    timecapsule.save(url, (err, result) => {
        console.log(err, result);
    });
  })

program
  .command('get <url>')
  .action((url) => {
    console.log(JSON.stringify(timecapsule.get(url), null, 4))
  });

program.parse(process.argv);
