// @flow

import path from 'path';
import cheerio from 'cheerio';
import tagsLoad from './listSrc';

export default (page, dir) => {
  const $ = cheerio.load(page);
  tagsLoad().map((tagLoad) => {
    const links = $('html').find(tagLoad.name);
    return links.filter(tag => $(links[tag]).attr(tagLoad.src))
    .map((tag) => {
      const currentHref = $(links[tag]).attr(tagLoad.src);
      const localHref = path.join(dir.split(path.sep).pop(), path.basename(currentHref));
      links[tag].attribs[tagLoad.src] = localHref;
      return links[tag];
    });
  });
  return $.html();
};
