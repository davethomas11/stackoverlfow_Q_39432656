'use strict';

const Boom = require('boom');
const Joi = require('joi');
const User = require('./user');

const internals = {
    createUserSchema: Joi.object({
        mobile: Joi.number().min(10).required()
    }),
    sendVerificationText: ((user, callback) => {

        return callback(null, true);
    })
};


module.exports = [{

    method: 'POST',
    path: '/api/users',
    config: {
        auth: false,
        handler: (request, reply) => {

            //looks up payload in db otherwise creates entry
            User.findOne({
                mobile: request.payload.mobile
            }, (err, record) => {

                if (err) {
                    return reply(Boom.badGateway(err));
                }
                if (record) {
                    // uses twillio to send code
                    internals.sendVerificationText(user, (err, result) => {

                        if (err){
                            return reply(Boom.badGateway(err));
                        }
                        if (result) {
                            // this is what I expect to happen when testing
                            return reply('code sent').code(201);
                        }
                        return reply(Boom.notFound(err));
                    });
                }
                else {
                    // the user should exist so....
                    const user = new User({
                        mobile: request.payload.mobile,
                        admin: false
                    });

                    user.save((err, doc) => {

                        if (err) {
                            return reply(Boom.badGateway(err));
                        }
                        internals.sendVerificationText(doc, (err, result) => {

                            if (err){
                                return reply(Boom.badGateway(err));
                            }
                            if (result) {
                                return reply('code sent').code(201);
                            }
                            return reply(Boom.notFound(err));
                        });
                    });
                }
            });
        },
        // Validate the payload against the Joi schema
        validate: {
            payload: internals.createUserSchema
        }
    }
}];
