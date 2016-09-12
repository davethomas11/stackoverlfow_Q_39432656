'use strict';

const Lab = require('lab');
const Code = require('code');
const Server = require('../lib');

const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;

describe('test users', () => {

    it('should register plugin with valid options', (done) => {

        const options = {
            method: 'POST',
            url: '/api/users',
            payload: {
                mobile: '3342329224'
            }
        };

        Server.start((err, server) => {

            expect(err).to.not.exist();

            server.inject(options, (response) => {

                expect(response.statusCode).to.equal(201);
                expect(response.payload).to.equal('code sent');
                done();
            });
        });
    });
});

