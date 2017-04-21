// @flow

import urlParse from 'url';

export default (address) => {
  const url = urlParse.parse(address);
  if (!url.hostname) {
    throw new Error('Incorrect address(must be as \'http://example.com\')');
  }
  return `${url.hostname}${url.pathname || ''}`.replace(/[^0-9a-z]/gi, '-');
};

