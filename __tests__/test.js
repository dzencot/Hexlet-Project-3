// @flow
/* eslint no-console: 0 */

import fs from 'mz/fs';
import os from 'os';
import nock from 'nock';
import path from 'path';
import pageLoader from '../src';

describe('test pageLoader', () => {
  let address;
  let dir;
  let testPageDir;
  let pageLoaded;
  let nameFile1;
  let nameFile1Loaded;
  let dataFile1;
  let nameFile2;
  let nameFile2Loaded;
  let dataFile2;
  let nameFile3;
  let nameFile3Loaded;
  let dataFile3;
  let page;

  beforeAll(() => {
    address = 'http://localhost/test';
    dir = fs.mkdtempSync(`${os.tmpdir()}${path.sep}`);
    testPageDir = './__tests__/__fixtures__';
    pageLoaded = `<html>
  <head>
    <title>Test Page</title>
  </head>
  <body>
    <h1>Test</h1>
    <p>data</p>
    <img>
    <link rel="shorcut icon" type="image/x-icon" href="localhost-test_files${path.sep}favicon-8fa102c058afb01de5016a155d7db433283dc7e08ddc3c4d1aef527c1b8502b6.ico">
    <img src="localhost-test_files${path.sep}favicon-196x196-422632c0ef41e9b13dd7ea89f1764e860d225ca3c20502b966a00c0039409a75.png">
    <script src="localhost-test_files${path.sep}application-4a22ec64913e57f9d297149cd20cb001db20febca800210f48729059b5103819.js" async="async" crossorigin="anonymous" onload="onApplicationJsLoaded(this)" onerror="onScriptLoadError(this)"></script>
  </body>
</html>
`;
    nameFile1 = 'application-4a22ec64913e57f9d297149cd20cb001db20febca800210f48729059b5103819.js';
    nameFile1Loaded = 'localhost-test-page-files-application-4a22ec64913e57f9d297149cd20cb001db20febca800210f48729059b5103819-js.js';
    dataFile1 = fs.readFileSync(path.resolve(testPageDir, 'test-page_files', nameFile1));
    nameFile2 = 'favicon-196x196-422632c0ef41e9b13dd7ea89f1764e860d225ca3c20502b966a00c0039409a75.png';
    nameFile2Loaded = 'localhost-test-page-files-favicon-196x196-422632c0ef41e9b13dd7ea89f1764e860d225ca3c20502b966a00c0039409a75-png.png';
    dataFile2 = fs.readFileSync(path.resolve(testPageDir, 'test-page_files', nameFile2));
    nameFile3 = 'favicon-8fa102c058afb01de5016a155d7db433283dc7e08ddc3c4d1aef527c1b8502b6.ico';
    nameFile3Loaded = 'localhost-test-page-files-favicon-8fa102c058afb01de5016a155d7db433283dc7e08ddc3c4d1aef527c1b8502b6-ico.ico';
    dataFile3 = fs.readFileSync(path.resolve(testPageDir, 'test-page_files', nameFile3));
    page = fs.readFileSync(path.resolve(testPageDir, 'test_page.html'));
  });

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


  it('test page-loader', (done) => {
    pageLoader(address, dir)
    .then(() => {
      const dataPage = fs.readFileSync(path.resolve(dir, 'localhost-test.html'), 'utf8');
      expect(dataPage).toBe(pageLoaded);
      const file1 = fs.readFileSync(path.resolve(dir, 'localhost-test_files', nameFile1Loaded));
      expect(file1).toBeDefined();
      const file2 = fs.readFileSync(path.resolve(dir, 'localhost-test_files', nameFile2Loaded));
      expect(file2).toBeDefined();
      const file3 = fs.readFileSync(path.resolve(dir, 'localhost-test_files', nameFile3Loaded));
      expect(file3).toBeDefined();
      done();
    })
    .catch(done.fail);
  });
  it('test page-loader errors', (done) => {
    pageLoader('wrong_address', dir)
    .catch((err) => {
      expect(err.message).toBe('Incorrect address(must be as \'http://examle.com\')');
      done();
    });

    pageLoader('http://localhost/wrong_page', dir)
    .catch((err) => {
      expect(err.statusCode).toBe(404);
      done();
    });

    pageLoader(address, dir)
    .catch((err) => {
      expect(err.message).toBe(`EEXIST: file already exists, mkdir '${dir}${path.sep}localhost-test_files'`);
      done();
    });
  });
});

