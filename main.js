"use strict";

var utils =    require(__dirname + '/lib/utils'); // Get common adapter utils
var adapter = utils.adapter('apiai');
var apiai = require('apiai');


adapter.on('unload', function (callback) {
    try {
        adapter.log.info('cleaned everything up...');
        callback();
    } catch (e) {
        callback();
    }
});


adapter.on('objectChange', function (id, obj) {
    // Warning, obj can be null if it was deleted
    adapter.log.info('objectChange ' + id + ' ' + JSON.stringify(obj));
});


adapter.on('stateChange', function (id, state) {
    // Warning, state can be null if it was deleted
    adapter.log.info('stateChange ' + id + ' ' + JSON.stringify(state));

    // you can use the ack flag to detect if it is status (true) or command (false)
    if (state && !state.ack) {
        adapter.log.info('ack is not set!');
    }
});

adapter.on('message', function (obj) {
    if (typeof obj == 'object' && obj.message) {
        if (obj.command == 'send') {
            // e.g. send email or pushover or whatever
            console.log('send command');

            // Send response in callback if required
            if (obj.callback) adapter.sendTo(obj.from, obj.command, 'Message received', obj.callback);
        }
    }
});


adapter.on('ready', function () {
    if(adapter.config.token!="") {

        main();
    }

});

function main(){
    apiai("привет");
    adapter.log.info('config test1: ' + adapter.config.token);
}

function apiai(textRequest) {

    adapter.log.info('ok ' + adapter.config.token);

    var app = apiai(adapter.config.token);

    var request = app.textRequest(textRequest, {
        sessionId: '1234567'
    });

    request.on('response', function(response) {
        adapter.log.info(JSON.stringify(response));
    });

    request.on('error', function(error) {
        adapter.log.info(JSON.stringify(error));

    });

    request.end();

}

