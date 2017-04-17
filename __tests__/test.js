// @flow

import fs from 'mz/fs';
import os from 'os';
import nock from 'nock';
import path from 'path';
import pageLoader from '../src';

describe('test pageLoader', () => {
  const address = 'http://localhost/test';
  const dir = os.tmpdir();
  const testPage = `<html>
  <head>
    <title>Test Page</title>
  </head>
  <body>
    <h1>Test</h1>
    <p>data</p>
  </body>
</html>
`;

  beforeEach(() => {
    nock('http://localhost')
    .get('/test')
    .reply(200, testPage);
  });
  it('test page saving', (done) => {
    pageLoader(address, dir)
    .then(() => fs.readFile(path.resolve(dir, 'localhost-test.html'), 'utf8'))
    .then(data => expect(data).toBe(testPage))
    .then(() => done());
  });
});

