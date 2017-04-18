// @flow
/* eslint no-console: 0 */

import program from 'commander';
import loader from '..';

program
  .version('1.0.0')
  .arguments('<address>')
  .action((address) => {
    loader(address, program.output)
    .then(() => process.exit(process.exitCode))
    .catch(err => console.log(err));
  })
  .description('Download page')
  .option('-o, --output [path]', 'ouptu path');

program.parse(process.argv);

