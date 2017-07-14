const scrape = require('website-scraper');
const moment = require('moment');
const fs = require('fs');
const path = require('path');
const express = require('express');
const async = require('async');
const compression = require('compression');
const normalizeUrl = require('normalize-url');

class Timecapsule {
    constructor(directory) {
        this.directory = directory || path.resolve(__dirname, 'capsules');
    }
    /**
     * this will save the url to a folder that is hashed to the url value and with sub folders with the dates they are saved
     * @function save
     * @property url - url of a website
     */
    save(url, callback) {
        url = normalizeUrl(url);

        const hashUrl = url.indexOf('://') > -1 ? url.substring(url.indexOf('://') + 3, url.length) : url;
        const hash = new Buffer(hashUrl).toString('base64');
        const date = moment().format('Y-M-D-h:mm:ss:a');

        const options = {
            urls: [url],
            prettifyUrls: true,
            recursive: true,
            maxRecursiveDepth: 2,
            maxDepth: 2,
            directory: `${this.directory}/${hash}/${date}`,
            request: {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0'
                }
            }
        };

        scrape(options)
            .then((result) => {
                callback ? callback(null, result) : console.log('success!'); // eslint-disable-line
            })
            .catch((err) => {
                callback ? callback(err, null) : console.error(err); // eslint-disable-line
            });
    }
    get(url, options, callback) {
        url = normalizeUrl(url);

        const web = options && options.web;
        const host = options && options.host;

        // if web is true, the path resolution should be changed to reflect url resolution
        const hashUrl = url.indexOf('://') > -1 ? url.substring(url.indexOf('://') + 3, url.length) : url;
        const hash = new Buffer(hashUrl).toString('base64');

        fs.readdir(path.resolve(this.directory, hash), (error, dates) => {
            if (error) return callback(error);

            dates = dates.filter((a) => moment(a, 'Y-M-D-h:mm:ss:a')._isValid).sort((a, b) => new Date(b) - new Date(a));

            if (web) {
                return callback(null, {
                    url,
                    hash,
                    recent: `${host}/v/${hash}/${dates[0]}/index.html`,
                    dates // moment(d, 'Y-M-D-h:mm:ss:a') to be able to parse the date into a valid date
                });
            } else {
                return callback(null, {
                    url,
                    hash,
                    directory: path.resolve(this.directory, hash),
                    recent: path.resolve(this.directory, hash, dates[0], 'index.html'),
                    dates
                });
            }
        });
    }
    getAll(options, callback) {
        return fs.readdir(path.resolve(this.directory), (error, directories) => {
            async.map(directories, (value, callback) => {
                this.get(new Buffer(value, 'base64').toString('utf8'), options, callback);
            }, callback);
        });
    }
    serve(port, callback) {
        const app = express();

        app.use(compression());
        app.use(express.static('dist'));

        app.get('/api/i/*', (req, res) => {
            const site = req.params[0];

            this.get(site, {
                web: true,
                host: req.headers['host']
            }, (err, result) => {
                if (err) {
                    return res.status(500).send({
                        error: err
                    });
                } else {
                    return res.status(200).send({
                        result: result
                    });
                }
            });
        });

        app.get('/api/b/*', (req, res) => {
            const site = req.params[0];

            this.save(site, (err, result) => {
                if (err) {
                    return res.status(500).send({
                        error: err
                    });
                } else {
                    return res.status(200).send({
                        result: result
                    });
                }
            });
        });

        app.get('/api/a', (req, res) => {
            this.getAll({
                web: true,
                host: req.headers['host']
            }, (err, result) => {
                if (err) {
                    return res.status(500).send({
                        error: err
                    });
                } else {
                    return res.status(200).send({
                        result: result
                    });
                }
            });
        });

        app.get('/v/*', (req, res) => {
            const site = req.params[0];

            res.sendFile(path.resolve(this.directory, site));
        });

        app.use('*', (req, res) => {
            res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
        });

        app.listen(port, callback);
    }
}

module.exports = Timecapsule;
