# node-timecapsule

[![Npm Version](https://img.shields.io/npm/v/node-timecapsule.svg)](https://www.npmjs.com/package/node-timecapsule)
[![Dependency Status](https://david-dm.org/gabrielcsapo/node-timecapsule.svg)](https://david-dm.org/gabrielcsapo/node-timecapsule)
[![devDependency Status](https://david-dm.org/gabrielcsapo/node-timecapsule/dev-status.svg)](https://david-dm.org/gabrielcsapo/node-timecapsule#info=devDependencies)
[![Build Status](https://travis-ci.org/gabrielcsapo/node-timecapsule.svg?branch=master)](https://travis-ci.org/gabrielcsapo/node-timecapsule)
[![npm](https://img.shields.io/npm/dt/node-timecapsule.svg)]()
[![npm](https://img.shields.io/npm/dm/node-timecapsule.svg)]()

> saving the internet for future generations

# Installation

```
npm install node-timecapsule
```

# Usage

> programmatic

```javascript
const Timecapsule = require('node-timecapsule');
const timecapsule = new Timecapsule(); // you can pass a directory to the constructor if you want to specific a different directory then the default, `capsules`.

timecapsule.save('http://www.bestbuy.com', (error, result) = > {
    // will return the resources saved or an error
});
```

> shell

```
$ timecapsule save http://www.bestbuy.com
```

# Screenshots

![main](./screenshots/main.png)

![backup](./screenshots/backup.png)
