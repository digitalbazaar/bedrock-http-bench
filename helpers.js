/*!
 * Copyright (c) 2018 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const api = {};
module.exports = api;

api.createIdentity = ({id, userName}) => ({
  id,
  type: 'Identity',
  sysSlug: userName,
  label: userName,
  email: userName + '@bedrock.dev',
  sysPassword: 'password',
  sysPublic: ['label', 'url', 'description'],
  sysResourceRole: [],
  url: 'https://example.com',
  description: userName,
  sysStatus: 'active'
});

api.createKeyPair = ({
  privateKeyBase58, privateKeyPem, publicKeyBase58, publicKeyPem, userId,
  userName
}) => {
  let ownerId = null;
  if(userName === 'userUnknown') {
    ownerId = '';
  } else {
    ownerId = userId;
  }
  const newKeyPair = {
    publicKey: {
      '@context': 'https://w3id.org/security/v2',
      id: ownerId + '/keys/1',
      type: ['CryptographicKey'],
      owner: ownerId,
      label: 'Signing Key 1',
    },
    privateKey: {
      type: 'CryptographicKey',
      owner: ownerId,
      label: 'Signing Key 1',
      publicKey: ownerId + '/keys/1',
    }
  };
  if(publicKeyPem) {
    newKeyPair.publicKey.publicKeyPem = publicKeyPem;
    newKeyPair.privateKey.privateKeyPem = privateKeyPem;
    newKeyPair.publicKey.type.push('RsaVerificationKey2018');
  }
  if(publicKeyBase58) {
    newKeyPair.publicKey.publicKeyBase58 = publicKeyBase58;
    newKeyPair.privateKey.privateKeyBase58 = privateKeyBase58;
    newKeyPair.publicKey.type.push('Ed25519VerificationKey2018');
  }

  return newKeyPair;
};
