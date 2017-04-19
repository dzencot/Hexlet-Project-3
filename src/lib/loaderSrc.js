// @flow

import cheerio from 'cheerio';
import path from 'path';
import url from 'url';
import axios from './axios';
import tagsLoad from './listSrc';
import getFileName from './getFileName';

const getLinks = (html, hostname) => {
  const $ = cheerio.load(html);
  return tagsLoad().reduce((acc, tagLoad) => {
    const links = $('html').find(tagLoad.name);
    links.filter(tag => $(links[tag]).attr(tagLoad.src)).toArray()
    .forEach((link) => {
      const current = link.attribs[tagLoad.src];
      const uri = url.parse(current);
      uri.hostname = uri.hostname || url.parse(hostname).hostname;
      uri.protocol = uri.protocol || url.parse(hostname).protocol;
      const formatedLink = url.format(uri);
      if (acc.indexOf(formatedLink) === -1) {
        acc.push(url.format(uri));
      }
    });
    return acc;
  }, []);
};

export default (html, hostname) => {
  const links = getLinks(html, hostname);
  const promises = links.map(link =>
    axios.get(link, { responseType: 'arraybuffer' }));
  return Promise.all(promises)
  .then(data => data.map((file) => {
    const ext = path.extname(file.config.url);
    const pathSave = `${getFileName(file.config.url)}${ext}`;
    return { pathSave, data: file.data };
  }));
};
