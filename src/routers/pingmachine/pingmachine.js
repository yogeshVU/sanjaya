/*globals define*/
/*jshint node:true*/

/**
 * Generated by RestRouterGenerator 2.2.0 from webgme on Tue Jul 18 2017 09:50:46 GMT-0500 (CDT).
 * To use in webgme add to gmeConfig.rest.components[<routePath>] = filePath.
 *
 * If you put this file in the root of your directory the following config,
 * gmeConfig.rest.component['path/subPath'] = path.join(process.cwd(), './pingmachine')
 * will expose, e.g. GET <host>/path/subPath/getExample, when running the server.
 */

'use strict';

// http://expressjs.com/en/guide/routing.html
var express = require('express'),
    runPlugin = require('webgme/src/bin/run_plugin'),
    router = express.Router();

 var webgme = require('webgme'),

    CONSTANTS = webgme.requirejs('common/Constants');



// consumer.js
var zmq = require( 'zmq' )
    , socket = zmq.socket( 'pull' );




/**
 * Called when the server is created but before it starts to listening to incoming requests.
 * N.B. gmeAuth, safeStorage and workerManager are not ready to use until the start function is called.
 * (However inside an incoming request they are all ensured to have been initialized.)
 *
 * @param {object} middlewareOpts - Passed by the webgme server.
 * @param {GmeConfig} middlewareOpts.gmeConfig - GME config parameters.
 * @param {GmeLogger} middlewareOpts.logger - logger
 * @param {function} middlewareOpts.ensureAuthenticated - Ensures the user is authenticated.
 * @param {function} middlewareOpts.getUserId - If authenticated retrieves the userId from the request.
 * @param {object} middlewareOpts.gmeAuth - Authorization module.
 * @param {object} middlewareOpts.safeStorage - Accesses the storage and emits events (PROJECT_CREATED, COMMIT..).
 * @param {object} middlewareOpts.workerManager - Spawns and keeps track of "worker" sub-processes.
 */
function initialize(middlewareOpts) {
    var logger = middlewareOpts.logger.fork('pingmachine'),
        ensureAuthenticated = middlewareOpts.ensureAuthenticated,
        getUserId = middlewareOpts.getUserId;

    logger.debug('initializing ...');

    // connect to original address
    socket.connect('tcp://0.0.0.0:9998');
    // messages come via events
    socket.on('message', function( msg ){
        console.log('got a message!');
        // messages come as buffers
        testplugin(middlewareOpts);
        console.log(msg.toString('utf8'));
    });


    // Ensure authenticated can be used only after this rule.
    router.use('*', function (req, res, next) {
        // TODO: set all headers, check rate limit, etc.

        // This header ensures that any failures with authentication won't redirect.
        res.setHeader('X-WebGME-Media-Type', 'webgme.v1');
        next();
    });

    // Use ensureAuthenticated if the routes require authentication. (Can be set explicitly for each route.)
    router.use('*', ensureAuthenticated);

    router.get('/getExample', function (req, res/*, next*/) {
        var userId = getUserId(req);
        var result = testplugin(middlewareOpts);

        res.json({userId: userId, message: 'get request was handled, result:'+ result });
    });

    router.patch('/patchExample', function (req, res/*, next*/) {
        res.sendStatus(200);
    });


    router.post('/postExample', function (req, res/*, next*/) {
        res.sendStatus(201);
    });

    router.delete('/deleteExample', function (req, res/*, next*/) {
        res.sendStatus(204);
    });

    router.get('/error', function (req, res, next) {
        next(new Error('error example'));
    });

    logger.debug('ready');
}

// THIS WILL CALL THE RUN PLUGIN USING THE REST ROUTER
function testplugin(middlewareOpts) {

    // runPlugin.main(['_', '_', 'testrouter', "router_test2"],
    //     function (err, result) {
    //         if (err) {
    //             return;
    //         }
    //     }
    // );

    var pluginContext = {
        managerConfig: {
            project: "guest+router_test2",
            branchName: "master"
        },
        pluginConfig: ""
    };
    var workerParameters = {
        command: CONSTANTS.SERVER_WORKER_REQUESTS.EXECUTE_PLUGIN,
        name: "testrouter",
        context: pluginContext
    };

    console.log("calling the plugin")
    //workerParameters.webgmeToken = 0;
    middlewareOpts.workerManager.request(workerParameters, function (err, result) {
        console.log("finished executing from workermanager")
        if(err){console.error(err)}
        else
        console.log(result)
    });
   return 0;
}


/**
 * Called before the server starts listening.
 * @param {function} callback
 */
function start(callback) {

    callback();
}

/**
 * Called after the server stopped listening.
 * @param {function} callback
 */
function stop(callback) {
    callback();
}


module.exports = {
    initialize: initialize,
    router: router,
    start: start,
    stop: stop
};
