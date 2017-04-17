// @flow

import cheerio from 'cheerio';
import path from 'path';
import axios from './axios';
import tagsLoad from './listSrc';

const getLinks = (html) => {
  const $ = cheerio.load(html);
  return tagsLoad().reduce((acc, tagLoad) => {
    const links = $('html').find(tagLoad.name);
    const currentLinks = links.filter(tag => $(links[tag]).attr(tagLoad.src));
    currentLinks.map((item) => {
      acc.push($(links[item]).attr(tagLoad.src));
      return acc;
    });
    return acc;
  }, []);
};

export default (html) => {
  const links = getLinks(html);
  const promises = links.map(link => axios.get(link, { responseType: 'arraybuffer' }));
  return Promise.all(promises)
  .then(data => data.map((file) => {
    const pathSave = path.basename(file.config.url);
    return { pathSave, data: file.data };
  }));
};
