(function() {
  'use strict';

  const fs = require('fs');

  const https = require('https');
  const key = fs.readFileSync('./basic-server.key');
  const cert = fs.readFileSync('./basic-server.crt');
  const bodyParser = require('body-parser');
  const express = require('express');
  const app = express();

  const cluster = require('cluster');
  // http = require('http'),
  const os = require('os');

  /*
   * ClusterServer object
   *
   * We start multi-threaded server instances by passing the server object
   * to ClusterServer.start(server, port).
   *
   * Servers are automatically started with a number of threads equivalent
   * to the number of CPUs reported by the os module.
   */
  const ClusterServer = {
    name: 'ClusterServer',

    cpus: os.cpus().length,

    autoRestart: true, // Restart threads on death?

    start: function(server, port) {
      const me = this;

      if(cluster.isMaster) { // fork worker threads
        for(let i = 0; i < me.cpus; i += 1) {
          console.log(me.name + ': starting worker thread #' + i);
          cluster.fork();
        }

        cluster.on('death', function(worker) {
          // Log deaths!
          console.log(me.name + ': worker ' + worker.pid + ' died.');
          // If autoRestart is true, spin up another to replace it
          if(me.autoRestart) {
            console.log(me.name + ': Restarting worker thread...');
            cluster.fork();
          }
        });
      } else {
        // Worker threads run the server
        server.listen(port);
      }
    }
  };

  // app.use(bodyParser.urlencoded({extended: false}));
  app.use(bodyParser.json());
  app.post('/post1', (req, res) => {
    // console.log('AAAAA', Date.now(), req.body);
    res.status(204).end();
  });

  const helloWorldServer = https.createServer({cert, key}, app);

  ClusterServer.name = 'helloWorldServer'; // rename ClusterServer instance
  ClusterServer.start(helloWorldServer, 18443); // Start it up!
}());
