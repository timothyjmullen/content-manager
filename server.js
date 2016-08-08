#!/bin/env node
//  OpenShift sample Node application
var express = require('express');
var fs      = require('fs');


/**
 *  Define the sample application.
 */
var SampleApp = function() {

    //  Scope.
    var self = this;


    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */

    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
    self.setupVariables = function() {
        //  Set the environment variables we need.
        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
        self.port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

        if (typeof self.ipaddress === "undefined") {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
            self.ipaddress = "127.0.0.1";
        };
    };


    /**
     *  Populate the cache.
     */
    self.populateCache = function() {
        if (typeof self.zcache === "undefined") {
            self.zcache = { 'library.html': '' };
        }

        //  Local cache for static content.
        self.zcache['login.html'] = fs.readFileSync('./login.html');
        self.zcache['privacy.html'] = fs.readFileSync('./privacy.html');
        self.zcache['profile.html'] = fs.readFileSync('./profile.html');
        self.zcache['cookies.html'] = fs.readFileSync('./cookies.html');
        self.zcache['library.html'] = fs.readFileSync('./library.html');
        self.zcache['docs.html'] = fs.readFileSync('./docs.html');
        self.zcache['template.html'] = fs.readFileSync('./template.html');
        self.zcache['admin.html'] = fs.readFileSync('./admin.html');

        self.zcache['ace.js'] = fs.readFileSync('./lib/ace.js');
        self.zcache['admin.js'] = fs.readFileSync('./lib/admin.js');
        self.zcache['adminauth.js'] = fs.readFileSync('./lib/adminauth.js');
        self.zcache['ext-searchbox.js'] = fs.readFileSync('./lib/ext-searchbox.js');
        self.zcache['ext-spellcheck.js'] = fs.readFileSync('./lib/ext-spellcheck.js');
        self.zcache['genauth.js'] = fs.readFileSync('./lib/genauth.js');
        self.zcache['library.js'] = fs.readFileSync('./lib/library.js');
        self.zcache['login.js'] = fs.readFileSync('./lib/login.js');
        self.zcache['mode-html.js'] = fs.readFileSync('./lib/mode-html.js');
        self.zcache['mode-javascript.js'] = fs.readFileSync('./lib/mode-javascript.js');
        self.zcache['openauth.js'] = fs.readFileSync('./lib/openauth.js');
        self.zcache['profile.js'] = fs.readFileSync('./lib/profile.js');
        self.zcache['theme-chrome.js'] = fs.readFileSync('./lib/theme-chrome.js');
        self.zcache['theme.css'] = fs.readFileSync('./lib/theme.css');
        self.zcache['worker-html.js'] = fs.readFileSync('./lib/worker-html.js');
        self.zcache['worker-javascript.js'] = fs.readFileSync('./lib/worker-javascript.js');
    };


    /**
     *  Retrieve entry (content) from cache.
     *  @param {string} key  Key identifying content to retrieve from cache.
     */
    self.cache_get = function(key) { return self.zcache[key]; };


    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function(sig){
        if (typeof sig === "string") {
           console.log('%s: Received %s - terminating sample app ...',
                       Date(Date.now()), sig);
           process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()) );
    };


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function(){
        //  Process on exit and signals.
        process.on('exit', function() { self.terminator(); });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
         'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() { self.terminator(element); });
        });
    };


    /*  ================================================================  */
    /*  App server functions (main app logic here).                       */
    /*  ================================================================  */

    /**
     *  Create the routing table entries + handlers for the application.
     */
    self.createRoutes = function() {
        self.routes = { };

        self.routes['/'] = function(req, res) {
            res.setHeader('Content-Type', 'text/html');
            res.send(self.cache_get('library.html') );
        };

        self.routes['/login'] = function(req, res) {
            res.setHeader('Content-Type', 'text/html');
            res.send(self.cache_get('login.html') );
        };

        self.routes['/admin'] = function(req, res) {
            res.setHeader('Content-Type', 'text/html');
            res.send(self.cache_get('admin.html') );
        };

        self.routes['/profile'] = function(req, res) {
            res.setHeader('Content-Type', 'text/html');
            res.send(self.cache_get('profile.html') );
        };

        self.routes['/cookies'] = function(req, res) {
            res.setHeader('Content-Type', 'text/html');
            res.send(self.cache_get('cookies.html') );
        };

        self.routes['/privacy'] = function(req, res) {
            res.setHeader('Content-Type', 'text/html');
            res.send(self.cache_get('privacy.html') );
        };

        self.routes['/library'] = function(req, res) {
            res.setHeader('Content-Type', 'text/html');
            res.send(self.cache_get('library.html') );
        };

        self.routes['/docs'] = function(req, res) {
            res.setHeader('Content-Type', 'text/html');
            res.send(self.cache_get('docs.html') );
        };

        self.routes['/template'] = function(req, res) {
            res.setHeader('Content-Type', 'text/html');
            res.send(self.cache_get('template.html') );
        };

        /*self.routes['/lib/.*'] = function(req, res) {
            res.setHeader('Content-Type', 'text/html');
            res.send(self.cache_get('template.html') );
        };*/

    };


    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    /*self.initializeServer = function() {
        self.createRoutes();
        self.app = express.createServer();
        self.app.use(express.static(__dirname + '/lib'));

        //  Add handlers for the app (from the routes).
        for (var r in self.routes) {
            self.app.get(r, self.routes[r]);
        }
    };*/

    self.initializeServer = function() {
      self.createRoutes();
      self.app = express.createServer();
      ['css', 'img', 'js', 'plugin', 'lib'].forEach(function (dir) {
        self.app.use('/'+dir, express.static(__dirname+'/'+dir));
      }); // Add handlers for the app (from the routes).
      for (var r in self.routes) {
        self.app.get(r, self.routes[r]);
      }
    };


    /**
     *  Initializes the sample application.
     */
    self.initialize = function() {
        self.setupVariables();
        self.populateCache();
        self.setupTerminationHandlers();

        // Create the express server and routes.
        self.initializeServer();
    };


    /**
     *  Start the server (starts up the sample application).
     */
    self.start = function() {
        //  Start the app on the specific interface (and port).

        self.app.listen(self.port, self.ipaddress, function() {
            console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), self.ipaddress, self.port);
        });
    };

};   /*  Sample Application.  */



/**
 *  main():  Main code.
 */
var zapp = new SampleApp();
zapp.initialize();
zapp.start();
