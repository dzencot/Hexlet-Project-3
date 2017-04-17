// @flow

import program from 'commander';
import loader from '..';

program
  .version('1.0.0')
  .arguments('<address>')
  .action(address =>
    loader(address, program.output))
  .description('Download page')
  .option('-o, --output [path]', 'ouptu path');

program.parse(process.argv);

