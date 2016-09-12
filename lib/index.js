'use strict';

const Hapi = require('hapi');
const Routes = require('./routes');


exports.start = (callback) => {

    const server = new Hapi.Server();
    server.connection({
        port: 3000
    });

    server.route(Routes);
    server.start((err) => {

        if (err) {
            return callback(err, null);
        }

        console.log(`Server running at: ${server.info.uri}`);
        return callback(null, server);
    });


};


