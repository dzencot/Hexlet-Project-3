// @flow

import url from 'url';

export default (host, link) => {
  const uri = url.parse(link);
  const result = {
    ...uri,
    hostname: uri.hostname || url.parse(host).hostname,
    protocol: uri.protocol || url.parse(host).protocol,
  };
  return url.format(result);
};

