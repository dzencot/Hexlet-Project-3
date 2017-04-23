// @flow
/* eslint no-console: 0 */

import program from 'commander';
import chalk from 'chalk';
import Listr from 'listr';
import debug from 'debug';
import loader from '..';

const debugError = debug('page-loader:error');

program
  .version('1.0.0')
  .arguments('<address>')
  .action((address) => {
    const taskFunc = (url, func, config) => {
      let result;
      const tasks = new Listr([
        {
          title: `Loading file '${url}'`,
          task: (ctx, task) => func(url, config)
          .then((data) => {
            result = data;
            return true;
          })
          .catch(err => task.skip(`Fail load '${url}'. ${err.message}`)),
        },
      ]);
      return tasks.run()
      .then(() => result);
    };
    loader(address, program.output, taskFunc)
    .then(() => process.exit(0))
    .catch((err) => {
      console.log(err);
      debugError(err);
      switch (err.code) {
        case 'ENOTFOUND':
          console.error(chalk.red(`404: page '${err.config.url}' not found.`));
          break;
        default:
          console.error(chalk.red(err.message));
      }
      process.exit(1);
    });
  })
  .description('Download page')
  .option('-o, --output [path]', 'ouptut path');

program.parse(process.argv);

