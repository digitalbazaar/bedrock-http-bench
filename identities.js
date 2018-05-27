/*!
 * Copyright (c) 2018 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const async = require('async');
const bedrock = require('bedrock');
const brIdentity = require('bedrock-identity');
const brKey = require('bedrock-key');
const {config} = bedrock;

bedrock.events.on('bedrock-mongodb.ready', callback =>
  _insert(config['http-bench'].identities, callback));

function _insert(identities, callback) {
  async.forEachOf(
    identities, (identity, key, callback) => async.parallel([
      callback => brIdentity.insert(null, identity.identity, callback),
      callback => {
        const {publicKey} = identity.keys;
        brKey.addPublicKey({actor: null, publicKey}, callback);
      }
    ], callback),
    err => {
      if(err) {
        if(!err.name == 'DuplicateError') {
          // duplicate error means test data is already loaded
          return callback(err);
        }
      }
      callback();
    }, callback);
}
