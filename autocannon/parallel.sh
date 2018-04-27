#!/usr/bin/env bash
export NODE_ENV=production
parallel ::: 'NODE_ENV=production node index.js' 'NODE_ENV=production node index.js' 'NODE_ENV=production node index.js' 'NODE_ENV=production node index.js'
