// @flow

import fs from 'fs';
import path from 'path';
import axios from './lib/axios';
import getFileName from './lib/getFileName';

export default (address, dir = './') => {
  const filePath = `${path.resolve(dir, getFileName(address))}.html`;
  return axios.get(address)
  .then(response => fs.writeFile(filePath, response.data))
  .catch(err => err);
};

