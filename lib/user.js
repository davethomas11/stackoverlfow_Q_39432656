'use strict';


//Mocked mongo behaviour for test
const User =  function () {

    this.save = (callback) => {

        return callback(null, this);
    };
};

User.findOne = ((obj, callback) => {

    return callback(null, null);
});

module.exports = User;
