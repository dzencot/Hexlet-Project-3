// @flow

import urlParse from 'url';

export default (address) => {
  const url = urlParse.parse(address);
  return `${url.hostname.replace(/[^0-9a-z]/gi, '-')}${url.pathname.replace(/[^0-9a-z]/gi, '-')}`;
};

