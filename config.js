/*!
 * Copyright (c) 2018 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const bedrock = require('bedrock');
const {config} = bedrock;

const cfg = config['http-bench'] = {};

cfg.routes = {
  post1: '/post1'
};

// core configuration
config.core.workers = 4;
