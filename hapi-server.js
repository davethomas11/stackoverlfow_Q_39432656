'use strict';

const Hapi = require('hapi');
const Boom = require('boom');
const Joi = require('joi');

const server = new Hapi.Server();
server.connection({ port: 3000 });

server.start((err) => {

    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});

//Mocked mongo behaviour for test
var User =  function () {

	var self = this;

	

	this.save = function(callback) {

		callback(null, self);
	};
}

User.findOne = function (obj, callback) {
	
	callback(null, null);
};

function sendVerificationText(user, callback) {

	callback(null, true);
}

server.route({

	method: 'POST',
    path: '/api/users',
    config: {
        auth: false,
        handler: (request, reply) => {

            //looks up payload in db otherwise creates entry
            User.findOne({
                mobile: request.payload.mobile
            }, (err, user) => {

                if (err) {
                    throw err;
                }
                if (user) {
                    // uses twillio to send code
                    sendVerificationText(user, (err, result) => {

                        if (err){
                            throw err;
                        }
                        if (result === true) {
                            // this is what I expect to happen when testing
                            reply('code sent').code(201);
                        }
                        else {
                            throw Boom.badRequest(err);
                        }
                    });
                }
                else {
                    // the user should exist so....
                    const user = new User();
                    user.mobile = request.payload.mobile;
                    user.admin = false;
                    user.save((err, user) => {

                        if (err) {
                            throw Boom.badRequest(err);
                        }
                        sendVerificationText(user, (err, result) => {

                            if (err){
                                throw err;
                            }
                            if (result === true) {
                                reply('code sent').code(201);
                            }
                            else {
                                throw Boom.badRequest(err);
                            }
                        });
                    });
                }
            });
        },
        // Validate the payload against the Joi schema
        validate: {
            payload: createUserSchema()
        }
    }
});

function createUserSchema() {
	return {
			mobile: Joi.number().integer().min(10)
        }
}