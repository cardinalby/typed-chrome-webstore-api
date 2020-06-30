[![Build Status](https://travis-ci.com/cardinalby/typed-chrome-webstore-api.svg?branch=master)](https://travis-ci.com/cardinalby/typed-chrome-webstore-api)
### Introduction
Typed Chrome Webstore API to upload/publish extensions and downloading crx file
### Installation
`npm install typed-chrome-webstore-api`
### How to use   
See https://developer.chrome.com/webstore/using_webstore_api to understand methods meaning and know how to get
`client_id`, `client_secret` and `refresh_token` strings needed for authentication.

To work with Webstore API you need to get token first:
```js
const fetchToken = require('typed-chrome-webstore-api').fetchToken;
const token = fetchToken('clientId', 'clientSecret', 'refreshToken');
```
Then create `WebstoreApi` instance initialized with token:
```js
const WebstoreApi = require('typed-chrome-webstore-api').WebstoreApi;
const api = new WebstoreApi(token);
```
##### Upload new extension
```js
// Any Readable stream or Buffer
const zip = fs.createReadStream('./mypackage.zip');
// Result format is defined as IWebstoreResource in d.ts file 
const result = await api.upload(zip);
```

##### Upload existed extension
`appId` is the ID of the existing Web Store item (could be found in admin panel)
```js
// Any Readable stream or Buffer
const zip = fs.createReadStream('./mypackage.zip');
// Result format is defined as IWebstoreResource in .d.ts file 
const result = await api.upload(zip, appId);
```

##### Check uploaded app/extension status
```js
// Result format is defined as IWebstoreResource in .d.ts file 
const result = await api.get(appId);
```

##### Publish item
```js
// 'default' or 'trustedTesters', defined in PublishTarget enum in .d.ts file
const target = 'default';
// Result format is defined as IPublishResponse in .d.ts file 
const result = await api.publish(appId, target);
```

Be aware of API's undocumented behaviour. For example, extension had a version = '1.10.0'
Then we successfully published a new one with version = '1.20.0' (status = 'OK')
'get upload' request returns version '1.20.0' after it. But this version is still in publishing progress
Now we are publishing '1.30.0' but 'publish' and request fails with 500 error, but (!) actually
Our version have been accepted, and after some time out extension increases it's version to '1.30.0'!

##### Get Licenses
```js
const result = await api.getLicenses(appId, userId);
```

##### Get User Licenses
```js
const result = await api.getUserLicenses(appId);
```

##### Get Payments
```js
const result = await api.getPayments(itemId);
```

##### Download extension crx
This feature is experimental because of API is not documented
```js
// A bit ugly, looks better if you use TypeScript :)
const downloadCrx = require('typed-chrome-webstore-api').DownloadCrx.downloadCrx;
const fs = require('fs');

const fstream = fs.createWriteStream('file.crx');
const readStream = await downloadCrx('extensionId');
readStream.pipe(fstream);
```
`downloadCrx()` also accepts additional options, look at `downloadCrx.d.ts` file for details
### Licence
MIT License