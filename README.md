# 1xbet Sports Line Parser @1xbetparser

## Other Available Languages

[English](README.md) - [Русский](README_RU.md) - [Español](README_ES.md) - [Türkçe](README_TR.md) - [中文](README_CN.md)

## Introduction

This code is posted for your acquaintance. To obtain the full working version, please contact us on Telegram [emresports](https://t.me/emresports).
We will provide the full source code of the parser and API. We will also provide configuration files and database files. Without them, the parser will not function.

## Description
The sports line and live parser operates in real-time mode and provides data on matches, outcomes, and odds. All data can be accessed online through the built-in sports line API.

### Installation
1. Unpack the archive on a VPS in any way you find convenient.
2. Upload the file `parserline.sql` to your MySQL database.
3. Specify the database connection in the `config.js` file:
```javascript
    "dbhost": "localhost",
    "dbdatabase": "parserline",
    "dbuser": "userdb",
    "dbpassword": "password"
```
4. Install [node.js](https://nodejs.org) version 16 or higher
5. Install node_modules with the command `npm install`
6. Start the parser and launch the API application.

To run your application on the server, use a [process manager like PM2](https://www.npmjs.com/package/pm2) or any other. This will ensure that your application restarts automatically in case of failure.

Start the application using the following command:
```bash
# Starts the data collection parser 'parser1x'
pm2 start parser1x.js

# Starts the server that serves the API
pm2 start ./bin/server

```

## Configuration Settings
1. Create a package in the database with any name and specify the package's expiration time in unixtime.
2. Specify which sports are available for the package <br>
`-1 - all sports are available` <br>
`or specify a list by ID, for example: 1|3|4|11|29 `<br>
3. Similarly, you can block countries <br>
`-1 - all countries are available` <br>
`123|3|4|255|29 - only the specified countries are available `<br>
4. There is also the possibility to block groups of outcomes and the outcomes themselves. For this, we specify their IDs. For example:

 ```javascript
# blocking groups with outcomes (specify the group ID)
groups":["154","856","3559","9316","9314","9315"]

# blocking specific outcomes (specify the group ID and the outcome ID)
"outcomes": ["2866|200","43|505","10062|1083","10063|1085"]

```

