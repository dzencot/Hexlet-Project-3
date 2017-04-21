// @flow

import path from 'path';
import cheerio from 'cheerio';
import debug from 'debug';
import tagsLoad from './listSrc';
import getFileName from './getFileName';
import getCurrentLink from './getCurrentLink';

const debugHrefLocal = debug('page-loader:href-local');
const debugHref = debug('page-loader:href');

export default (page, dir, host) => {
  const $ = cheerio.load(page);
  tagsLoad().forEach((tagLoad) => {
    const links = $('html').find(tagLoad.name);
    links.each((i) => {
      if ($(links[i]).attr(tagLoad.src)) {
        const ext = path.extname($(links[i]).attr(tagLoad.src));
        const currentLink = getCurrentLink(host, $(links[i]).attr(tagLoad.src));
        const localHref = path.join(dir, `${getFileName(currentLink)}${ext}`);
        debugHref(currentLink);
        debugHrefLocal(localHref);
        $(links[i]).attr(tagLoad.src, localHref);
      }
    });
  });
  return $.html();
};
