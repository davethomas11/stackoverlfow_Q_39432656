'use strict';

const Server = require('./lib');

Server.start((err, server) => {

    if (err) {
        throw err;
    }

    console.log(`Server running at: ${server.info.uri}`);
});