// @flow

import fs from 'mz/fs';
import path from 'path';
import axios from './lib/axios';
import getFileName from './lib/getFileName';
import getSrces from './lib/loaderSrc';
import setLocalSrc from './lib/setLocalSrc';

const debug = require('debug')('page-loader');

export default (address, dir = '.') => {
  const filePageName = getFileName(address);
  const filesDir = path.resolve(dir, `${filePageName}_files`);
  return fs.mkdir(filesDir)
  .then(() => debug(`mkdir ${filesDir}`))
  .then(() => axios.get(address))
  .then((response) => {
    debug('Page have been loaded.');
    const page = setLocalSrc(response.data, `${filePageName}_files`);
    debug('Links have been replaced by local.');
    const promisePageSave = fs.writeFile(path.resolve(dir, `${filePageName}.html`), page)
    .then(() => debug('Page have been saved.'));
    const promiseFilesSave = getSrces(response.data, address).then((files) => {
      const promises = files.map(file =>
        fs.writeFile(path.resolve(filesDir, file.pathSave), file.data)
        .then(() => debug(`File ${file.pathSave} saved.`)));
      return Promise.all(promises);
    })
    .then(() => debug('Resources have been saved.'));
    return Promise.all([promiseFilesSave, promisePageSave]);
  });
};

