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
    if(id==adapter.namespace +'.request.request'){
        setapiai(state.val);
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
        adapter.log.info('main start ');
        main();
        setapiai('привет');
    }else{
        adapter.log.info('Not a valid token' );
    }

});

function main(){

    adapter.log.info('config test1: ' + adapter.config.token);
    newVar("respons","respons")
    newVar("request","request")

    adapter.subscribeStates('*');



}

function newVar(setid,value){
    adapter.setObject(setid+"."+value, {
        type: 'state',
        common: {
            name: value,
            type: 'mixed',
            role: 'indicator'
        },
        native: {}
    });
}

function setapiai(textRequest) {
    var app = apiai(adapter.config.token);
    var request = app.textRequest(textRequest, {
        sessionId: '1234567'
    });

    request.on('response', function(response) {
        adapter.log.info("respons "+JSON.stringify(response));
        adapter.setState('respons.respons', {val: JSON.stringify(response), ack: true});

        JSON.parse(JSON.stringify(response), function(k, v) {
            if(typeof v != "object"){
                newVar("respons.test",k)
                adapter.setState('respons.test.'+k, {val: v, ack: true});
            }
        });
    });

    request.on('error', function(error) {
        adapter.log.warn("error "+JSON.stringify(error));

    });

    request.end();

}


