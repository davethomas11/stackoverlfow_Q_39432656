var Lab = require("lab");
var Code = require("code");

var Server = require("../hapi-server.js");
var lab = exports.lab = Lab.script();

lab.experiment("Users", function() {

	lab.test("user post", function (done) {

	    const options = {
		    method: 'POST',
		    url: '/api/users',
		    payload: JSON.stringify({ mobile: '3342329224' })
		};

		Server.inject(options, (response) => {

		    if (response) {
		        console.log(response.payload);
		    }
		    else {
		        console.log('Nada');
		    }

		    Code.expect(response.statusCode).to.equal(201);
		    Code.expect(response.payload).to.equal("code sent");
			done();
		});
	});

});
