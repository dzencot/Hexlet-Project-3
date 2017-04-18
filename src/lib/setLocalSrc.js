// @flow

import path from 'path';
import cheerio from 'cheerio';
import tagsLoad from './listSrc';

export default (page, dir) => {
  const $ = cheerio.load(page);
  tagsLoad().forEach((tagLoad) => {
    const links = $('html').find(tagLoad.name);
    links.each((i) => {
      if ($(links[i]).attr(tagLoad.src)) {
        const localHref = path.join(dir,
          path.basename($(links[i]).attr(tagLoad.src)));
        $(links[i]).attr(tagLoad.src, localHref);
      }
    });
  });
  return $.html();
};
