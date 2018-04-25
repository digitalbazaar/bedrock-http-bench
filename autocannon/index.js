/*!
 * Copyright (c) 2018 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const autocannon = require('autocannon');
let connection = 0;

const operation = {
  // '@context': constants.WEB_LEDGER_CONTEXT_V1_URL,
  '@context': 'https://w3id.org/webledger/v1',
  type: 'CreateWebLedgerRecord',
  record: {
    '@context': {'@vocab': 'https://w3id.org/payments#'},
    '@id': `https://example.com/transaction/${Math.floor(Math.random() * 100000000000)}`,
    sourceAccount: Math.floor(Math.random() * 100000000000),
    destinationAccount: Math.floor(Math.random() * 1000000000000),
    memo: `Transaction ${Math.floor(Math.random() * 1000000000000)}`,
    proof: {
      type: 'Ed25519Signature2018',
      created: '2018-02-19T14:48:48Z',
      creator: 'did:v1:test:nym:8IyxSpzUFcby2pe_oSdsbjb_1hLjo0eqaQSNRPrpUxw#ocap-invoke-key-1',
      capability: 'did:v1:test:nym:8IyxSpzUFcby2pe_oSdsbjb_1hLjo0eqaQSNRPrpUxw',
      capabilityAction: 'transact',
      jws: 'eyJhbGciOiJSUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..u-alElcqe_xri6GLL10Ozi1LwLO9HpUXmsRqnjTa7jhAf1pFbAjdGDNhDjg0QvCIw',
      proofPurpose: 'invokeCapability'
    }
  },
  proof: {
    type: 'Ed25519Signature2018',
    created: '2018-02-19T14:48:48Z',
    creator: 'did:v1:test:nym:8IyxSpzUFcby2pe_oSdsbjb_1hLjo0eqaQSNRPrpUxw#ocap-invoke-key-1',
    capability: 'did:v1:test:nym:8IyxSpzUFcby2pe_oSdsbjb_1hLjo0eqaQSNRPrpUxw',
    capabilityAction: 'CreateWebLedgerRecord',
    jws: 'eyJhbGciOiJSUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..u-alElcqe_xri6GLL10Ozi1LwLO9HpUXmsRqnjTa7jhAf1pFbAjdGDNhDjg0QvCIw',
    proofPurpose: 'invokeCapability'
  }
};

autocannon({
  // url: 'https://bedrock.local:18443/post1',
  body: JSON.stringify(operation),
  headers: {
    'Content-Type': 'application/json'
  },
  url: 'https://ip-172-31-23-152.ec2.internal:18443/post1',
  // url: 'http://bedrock.local:18080/post1',
  url: 'https://bedrock.local:18443/post1',
  method: 'POST',
  connections: 20, //default
  pipelining: 1, // default
  duration: 10, // default
  // setupClient: setupClient
}, console.log);

function setupClient(client) {
  // console.log('CCCCCCCC', client.setBody);
  connection++;
  client.setBody(JSON.stringify({matt: 1}));
}
