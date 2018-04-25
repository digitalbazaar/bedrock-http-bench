/*!
 * Copyright (c) 2018 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const async = require('async');
const bedrock = require('bedrock');
const {config} = bedrock;
const request = require('request');

require('bedrock-express');

require('./config.js');

bedrock.events.on('bedrock-cli.init', () =>
  bedrock.program.option('--aws', 'Configure for AWS.'));

bedrock.events.on('bedrock-cli.ready', callback => {
  if(bedrock.program.aws) {
    // require('./config-aws');
    const metaBase = 'http://169.254.169.254/latest/meta-data';
    const lhn = `${metaBase}/local-hostname/`;
    const phn = `${metaBase}/public-hostname/`;
    return async.auto({
      lhn: callback => request.get(lhn, (err, res) => callback(err, res.body)),
      phn: callback => request.get(phn, (err, res) => callback(err, res.body)),
    }, (err, results) => {
      if(err) {
        return callback(err);
      }
      config.server.domain = results.lhn;
      callback();
    });
  }
  callback();
});

// only run application on HTTP port
// bedrock.events.on('bedrock-express.ready', function(app) {
//   // attach express to regular http
//   require('bedrock-server').servers.http.on('request', app);
//   // cancel default behavior of attaching to HTTPS
//   return false;
// });

bedrock.events.on('bedrock-express.configure.routes', app => {
  const routes = config['http-bench'].routes;

  app.post(routes.post1, (req, res) => {
    // console.log('LLLLL', req.body);
    res.status(204).end();
  });
});

bedrock.start();
