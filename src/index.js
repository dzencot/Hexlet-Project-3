// @flow

import fs from 'mz/fs';
import path from 'path';
import debug from 'debug';
import os from 'os';
import axios from './lib/axios';
import getFileName from './lib/getFileName';
import getSrces from './lib/loaderSrc';
import setLocalSrc from './lib/setLocalSrc';

const httpDebug = debug('page-loader:http');
const osDebug = debug('page-loader:os');
const pathDebug = debug('page-loader:path');
const loaderDebug = debug('page-loader:loader');

export default (address, dir = '.') => {
  let filePageName;
  let filesDir;
  let tempDir;
  return Promise.resolve()
  .then(() => getFileName(address))
  .then((fileName) => {
    filePageName = fileName;
    return true;
  })
  .then(() => fs.mkdtemp(`${os.tmpdir()}${path.sep}`))
  .then((pathTmp) => {
    tempDir = pathTmp;
    filesDir = path.resolve(tempDir, `${filePageName}_files`);
  })
  .then(() => axios.get(address))
  .then((response) => {
    loaderDebug(`address: '${address}'`);
    loaderDebug(`output: '${dir}'`);
    httpDebug('Page have been loaded.');
    const page = setLocalSrc(response.data, `${filePageName}_files`, address);
    loaderDebug('Links have been replaced by local.');
    const promisePageSave = fs.writeFile(path.resolve(tempDir, `${filePageName}.html`), page)
    .then(() => osDebug('Page have been saved.'));
    const promiseFilesSave = fs.mkdir(filesDir)
    .then(() => osDebug(`Dir '${filesDir}' created.`))
    .then(() => getSrces(response.data, address)).then((files) => {
      const promises = files.map((file) => {
        const filePath = path.resolve(filesDir, file.pathSave);
        return fs.writeFile(filePath, file.data)
        .then(() => {
          osDebug(`File saved '${file.pathSave}'`);
          pathDebug(`path: '${filePath}'`);
        });
      });
      return Promise.all(promises);
    })
    .then(() => loaderDebug('Resources have been saved.'));
    return Promise.all([promiseFilesSave, promisePageSave]);
  })
  .then(() => fs.readFile(path.resolve(tempDir, `${filePageName}.html`)))
  .then(data => fs.writeFile(path.resolve(dir, `${filePageName}.html`), data))
  .then(() => fs.mkdir(path.resolve(dir, `${filePageName}_files`)))
  .then(() => fs.readdir(filesDir))
  .then((files) => {
    const promises = files.map((file) => {
      const name = path.basename(file);
      return fs.readFile(path.resolve(filesDir, file))
      .then(data => fs.writeFile(path.resolve(dir, `${filePageName}_files`, name), data));
    });
    return Promise.all(promises);
  });
};

