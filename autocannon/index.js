/*!
 * Copyright (c) 2018 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const autocannon = require('autocannon');
const crypto = require('crypto');
const jsprim = require('jsprim');

const nodeRsaKeyPair = {
  publicKeyPem: '-----BEGIN PUBLIC KEY-----\n' +
    'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArpPmWDG3MCn3simEGNIe\n' +
    'seNe3epn81gLnWXjup458yXgjUYFqKcFlsV5oW4vSF5EEQfPqWB+E5NWYfE9IioQ\n' +
    'mmQjh28BhMXHq94HgQ90nKQ3KTpAMOXNefvcun+qqOyr4Jf8y8esiYHjuitZA03o\n' +
    '9OhzpqJwFzQj7Nxx2dg/3LnkcsP1/RtY5zxnyEGEnxR+Sy+bPXEMbBk0+C3Wrnmn\n' +
    'LxNEwvWKj3iDp4JyLeV3WxWIf3ExgdkOWv3DwVo7pPmrSg+kQaU20QxQycY2xW7J\n' +
    '8xqsqrvR3ICdYIevjFknMHX1LZB5R6nfosG90pWVA2m5LqnAoEMBnG/CUpvxPRYy\n' +
    'jwIDAQAB\n' +
    '-----END PUBLIC KEY-----\n',
  privateKeyPem: '-----BEGIN RSA PRIVATE KEY-----\n' +
    'MIIEpQIBAAKCAQEArpPmWDG3MCn3simEGNIeseNe3epn81gLnWXjup458yXgjUYF\n' +
    'qKcFlsV5oW4vSF5EEQfPqWB+E5NWYfE9IioQmmQjh28BhMXHq94HgQ90nKQ3KTpA\n' +
    'MOXNefvcun+qqOyr4Jf8y8esiYHjuitZA03o9OhzpqJwFzQj7Nxx2dg/3LnkcsP1\n' +
    '/RtY5zxnyEGEnxR+Sy+bPXEMbBk0+C3WrnmnLxNEwvWKj3iDp4JyLeV3WxWIf3Ex\n' +
    'gdkOWv3DwVo7pPmrSg+kQaU20QxQycY2xW7J8xqsqrvR3ICdYIevjFknMHX1LZB5\n' +
    'R6nfosG90pWVA2m5LqnAoEMBnG/CUpvxPRYyjwIDAQABAoIBAQCJZBpfBFlQDWdD\n' +
    'jorIYe0IQJGzgjvm9j7F058iik2+/us3I4lmjnPGkYlEs4uAn7df087pVOhEDatp\n' +
    'D0r2bTZ92xtfBcyjKmgW6XjsaDZ05IQI7TABi4lnXAD9wWWU5hXqfpLT6UPvQArx\n' +
    'xBWclR8mRx5lYOdoS3+OdHshX5/63ACCYlYonTov2TkIjvozQY4H5F0M0aaF3naM\n' +
    'GFRus8qmJTrfBmQPBBwRJnPJLQk03hAHXRyUHGHAo5QVZlEdvf5LeOTIfsw2X9ro\n' +
    'xGFBIruS2JfrWHbApTOIYlzCQBpBBM28l4/rvkfEDmugYaZE9LdpQfddQJOrnqXF\n' +
    'xHARbO0JAoGBANjqe0YKPsW/i6MEN0kOhcpYm19GYceXTSgErDsTDeEcvv6o9Chi\n' +
    'baRyNK1tZ+Kff4rMw74Vw+uIfpq5ROiTJ67p094jVmZhgmKsXAqIbapcR+R+bygO\n' +
    'Q3UioXCTCYvPKWL8n8FdgFsBohK4+y5NCgNZ8tIxqvB1fLQDs9AdhOxjAoGBAM4I\n' +
    'g/fUY5oBFS4KrMCQbz+DPzDTgMGrX0ZC7BD6S9jX/AI4Wwm11t/WWGuijUiQaFFd\n' +
    'YUHXVoe6qRuYemND2zUvbpBK84SVVxF3a6lncmpnxiLe2lHbj5/Dh+y/C7HKGiTC\n' +
    'jTfvfe8YAeTpC1djIH0sWPC6n91ulyA23Nz4h6rlAoGBAJVUT0s3cGF4bSvrkhfU\n' +
    'TJyxhT0A2f2qlm5PUTZV9r8bqAzuyS8oG60TBlrCL7te7FHkh3jLyRXT4LypgNvP\n' +
    'uoj65mVN1IQk6rr9R1vk8gJPBxsxQ1rC/wObtKIoR3EdS7OekGhw8xUzuZzEBf+o\n' +
    '/5SxDq5PjQt/BjtzNQ231LNbAoGAGDab+8Y0Jmc2LAEJKGBREq/D/2L74MbZHZLD\n' +
    '14Ly4vsPHNuup0d9hzTTk2K5I+wEtns48Nnzy2O+eAXFbGEPJAL9BWwpjk1WvDDC\n' +
    'sFf99E9Z08NI+RHKoUYDdWlGYJCV3fgXTJmSvUSfBF32/UAjE1Lg6PmlzAoxLJIG\n' +
    'BtoWZ5kCgYEAnvcfRx56ZvUkWJiSI0me+M20A74IGwxDPF87XuGPSEqcoLSc1qJM\n' +
    '6LtOFUE7nFVEqFMN2IhW59qb2eCg7XpeEQic4aqNkc8WtuMEavHRTucsEWk+ypZv\n' +
    'JCxLDG7o3iSqT+DNbYnDI7aUCuM6Guji98q3IvBnW5hj+jbmo4sfRDQ=\n' +
    '-----END RSA PRIVATE KEY-----\n'
};

const operation = JSON.stringify({
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
});

const requests = [];
// const host = 'bedrock.local:18443';
const host = 'ip-172-31-28-98.ec2.internal:18443';
// const path = '/post2';
const path = '/post3';
console.log('Generating operations...');
for(let i = 0; i < 1; ++i) {
  const rsaSign = crypto.createSign('RSA-SHA256');
  let stringToSign = '';
  stringToSign += `(request-target): post ${path}\n`;
  stringToSign += `host: ${host}\n`;
  const d = jsprim.rfc1123(new Date());
  stringToSign += `date: ${d}`;
  rsaSign.update(stringToSign);
  const signature = rsaSign.sign({
    key: nodeRsaKeyPair.privateKeyPem,
    // padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
    // saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST
  }, 'base64');
  const authz = 'Signature keyId="did:7e4a0145-c821-4e56-b41e-2e73e1b0615f/keys/1",' +
    'algorithm="rsa-sha256",' +
    'headers="(request-target) host date",signature="' + signature + '"';
  requests.push({
    body: operation,
    headers: {
      'Authorization': authz,
      'Content-Type': 'application/json',
      'Date': d,
      host
    }
  });
}
console.log('Done.  Starting to send operations...');

autocannon({
  url: `https://${host}${path}`,
  body: requests[0].body,
  // headers: requests[0].headers,
  // url: 'https://bedrock.local:18443/post1',
  // body: JSON.stringify(operation),
  // headers: {
  //   'Content-Type': 'application/json'
  // },
  // url: 'https://ip-172-31-23-152.ec2.internal:18443/post1',
  // url: 'https://ip-172-31-23-152.ec2.internal:18443/post2',
  // url: 'http://bedrock.local:18080/post1',
  // url: 'https://bedrock.local:18443/post1',
  // url: 'https://bedrock.local:18443/post2',
  method: 'POST',
  connections: 100, //default
  pipelining: 1, // default
  duration: 60, // default
  // requests,
  // setupClient
}, console.log);

function setupClient(client) {
  const rsaSign = crypto.createSign('RSA-SHA256');
  // console.log('CCCCCCCC', client.opts.host);
  const {host, path} = client.opts;
  let stringToSign = '';
  stringToSign += `(request-target): post ${path}\n`;
  stringToSign += `host: ${host}\n`;
  const d = jsprim.rfc1123(new Date());
  stringToSign += `date: ${d}`;
  rsaSign.update(stringToSign);
  const signature = rsaSign.sign({
    key: nodeRsaKeyPair.privateKeyPem,
    // padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
    // saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST
  }, 'base64');
  // console.log('SSSSSS', signature);
  const authz = 'Signature keyId="did:7e4a0145-c821-4e56-b41e-2e73e1b0615f/keys/1",' +
    'algorithm="rsa-sha256",' +
    'headers="(request-target) host date",signature="' + signature + '"';
  client.setHeadersAndBody({
    'Authorization': authz,
    'Content-Type': 'application/json',
    'Date': d,
    host
  }, operation);
}
