'use strict';

const Hapi = require('hapi');

const server = Hapi.server({
    host: 'localhost',
    port: 3000
});

server.route({
    method: 'GET',
    path: '/',
    /* Here to correct the statusCode 400 because of Invalid Cookie Value */
    config: {
        state: {
          parse: false, // parse and store in request.state
          failAction: 'ignore' // may also be 'ignore' or 'log'
        }
    },
    /* h is the response toolkit, an object with several methods 
    used to respond to the request */
    handler: (request, h) => {
        return 'Hello, world!';
    },
});

server.route({
    method: 'GET',
    path: '/{name}',
    config: {
        state: {
          parse: false, // parse and store in request.state
          failAction: 'ignore' // may also be 'ignore' or 'log'
        }
    },
    handler: (request, h) => {
        /* request.log(['a', 'name'], "Request name"); or */
        request.logger.info('In handler %s', request.path);
        return `Hello, ${encodeURIComponent(request.params.name)}!`;
    }
});

const init = async () => {

    await server.register({
        plugin: require('hapi-pino'),
        options: {
            prettyPrint: false,
            logEvents: ['response']
        }
    });

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();