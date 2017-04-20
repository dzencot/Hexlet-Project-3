// @flow

import cheerio from 'cheerio';
import path from 'path';
import url from 'url';
import debug from 'debug';
import axios from './axios';
import tagsLoad from './listSrc';
import getFileName from './getFileName';

const sourcesDebug = debug('page-loader:src');

const getCurrentLink = (host, link) => {
  const uri = url.parse(link);
  const result = {
    ...uri,
    hostname: uri.hostname || url.parse(host).hostname,
    protocol: uri.protocol || url.parse(host).protocol,
  };
  return url.format(result);
};

const getLinks = (html, hostname) => {
  const $ = cheerio.load(html);
  return tagsLoad().reduce((acc, tagLoad) => {
    const links = $('html').find(tagLoad.name);
    links.filter(tag => $(links[tag]).attr(tagLoad.src)).toArray()
    .forEach((link) => {
      const currentLink = getCurrentLink(hostname, link.attribs[tagLoad.src]);
      if (acc.indexOf(currentLink) === -1) {
        acc.push(currentLink);
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
    sourcesDebug(`'${file.config.url}' loaded.`);
    const ext = path.extname(file.config.url);
    const pathSave = `${getFileName(file.config.url)}${ext}`;
    return { pathSave, data: file.data };
  }));
};
