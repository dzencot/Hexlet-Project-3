// @flow

import fs from 'mz/fs';
import path from 'path';
import axios from './lib/axios';
import getFileName from './lib/getFileName';
import getSrces from './lib/loaderSrc';
import setLocalSrc from './lib/setLocalSrc';

export default (address, dir = '.') => {
  const filePageName = getFileName(address);
  const filesDir = path.resolve(dir, `${filePageName}_files`);
  return fs.mkdir(filesDir)
  .then(() => axios.get(address))
  .then((response) => {
    const page = setLocalSrc(response.data, `${filePageName}_files`);
    const promisePageSave = fs.writeFile(path.resolve(dir, `${filePageName}.html`), page);
    const promiseFilesSave = getSrces(response.data, address).then((files) => {
      const promises = files.map(file =>
        fs.writeFile(path.resolve(filesDir, file.pathSave), file.data));
      return Promise.all(promises);
    });
    return Promise.all([promiseFilesSave, promisePageSave]);
  });
};

