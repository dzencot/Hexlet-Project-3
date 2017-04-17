// @flow

import fs from 'mz/fs';
import os from 'os';
import nock from 'nock';
import path from 'path';
import pageLoader from '../src';

describe('test pageLoader', () => {
  const address = 'http://localhost/test';
  const dir = fs.mkdtempSync(`${os.tmpdir()}${path.sep}`);
  const testPageDir = './__tests__/__fixtures__';
  const pageLoaded = `<html>
  <head>
    <title>Test Page</title>
  </head>
  <body>
    <h1>Test</h1>
    <p>data</p>
    <link rel="shorcut icon" type="image/x-icon" href="localhost-test_files${path.sep}favicon-8fa102c058afb01de5016a155d7db433283dc7e08ddc3c4d1aef527c1b8502b6.ico">
    <img src="localhost-test_files${path.sep}favicon-196x196-422632c0ef41e9b13dd7ea89f1764e860d225ca3c20502b966a00c0039409a75.png">
    <script src="localhost-test_files${path.sep}application-4a22ec64913e57f9d297149cd20cb001db20febca800210f48729059b5103819.js" async="async" crossorigin="anonymous" onload="onApplicationJsLoaded(this)" onerror="onScriptLoadError(this)"></script>
  </body>
</html>
`;
  const page = fs.readFileSync(path.resolve(testPageDir, 'test_page.html'));
  const nameFile1 = 'application-4a22ec64913e57f9d297149cd20cb001db20febca800210f48729059b5103819.js';
  const dataFile1 = fs.readFileSync(path.resolve(testPageDir, 'test-page_files', nameFile1));
  const nameFile2 = 'favicon-196x196-422632c0ef41e9b13dd7ea89f1764e860d225ca3c20502b966a00c0039409a75.png';
  const dataFile2 = fs.readFileSync(path.resolve(testPageDir, 'test-page_files', nameFile2));
  const nameFile3 = 'favicon-8fa102c058afb01de5016a155d7db433283dc7e08ddc3c4d1aef527c1b8502b6.ico';
  const dataFile3 = fs.readFileSync(path.resolve(testPageDir, 'test-page_files', nameFile3));

  beforeEach(() => {
    nock('http://localhost')
    .get('/test')
    .reply(200, page)
    .get(`/test-page_files/${nameFile1}`)
    .reply(200, dataFile1)
    .get(`/test-page_files/${nameFile2}`)
    .reply(200, dataFile2)
    .get(`/test-page_files/${nameFile3}`)
    .reply(200, dataFile3);
  });
  it('test page saving', (done) => {
    pageLoader(address, dir);
    fs.readFile(path.resolve(dir, 'localhost-test.html'), 'utf8')
    .then(data => expect(data).toBe(pageLoaded))
    .then(() => fs.readFile(path.resolve(dir, 'localhost-test_files', nameFile1)))
    .then(file1 => expect(file1.data).toBe(dataFile1.data))
    .then(() => fs.readFile(path.resolve(dir, 'localhost-test_files', nameFile2)))
    .then(file2 => expect(file2.data).toBe(dataFile2.data))
    .then(() => fs.readFile(path.resolve(dir, 'localhost-test_files', nameFile3)))
    .then(file3 => expect(file3.data).toBe(dataFile3.data))
    .catch((err) => {
      throw err;
    })
    .then(done());
  });
});

