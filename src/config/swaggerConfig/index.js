
import swaggerTools from 'swagger-tools';
import express from 'express';
import { error } from 'express-easy-helper';
// import { mw } from '../../auth/services/mw';
// import authorizationHanlder from '../../aaa/authorization/authorizationHandler';
// import authChecker from '../../aaa/authorization/authChecker';
import config from '../index';

export function index(app) {
    let swaggerConfig = require('./config').default(app);
    let routerConfig = {
        controllers: [
            // `${config.base}/api/gpp/allergies`,

        ],
        useStubs: false // If you want use examples.
    };
    swaggerTools.initializeMiddleware(swaggerConfig, middleware => {
        // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
        app.use(middleware.swaggerMetadata());

        // Provide the security handlers
        app.use(middleware.swaggerSecurity({
            Context: ((req, authOrSecDef, token, cb) => {
                authChecker.getUserContext(req, authOrSecDef, token, cb);
            }),
            AuthChecks: ((req, authOrSecDef, token, cb) => {
                authChecker.checkStatus(req, authOrSecDef, cb);
            }),
            Bearer: ((req, authOrSecDef, token, cb) => {
                authorizationHanlder.authorizeRequest(req, authOrSecDef, cb);
            })
        }));

        // Validate Swagger requests
        app.use(middleware.swaggerValidator({ validateResponse: false }));

        // Route validated requests to appropriate controller need to open
        app.use(middleware.swaggerRouter(routerConfig));

        // Serve the Swagger documents and Swagger UI
        //   http://localhost:8000/docs => Swagger UI
        //   http://localhost:8000/api-docs => Swagger document
        // app.use(middleware.swaggerUi());

        app.use(errorHandler);

        router(app, swaggerConfig);
    });
}

function router(app, swaggerConfig) {
    if (config.oAuth) {
        Object.keys(config.oAuth).forEach(elem => {
            if (elem !== 'local') {
                delete swaggerConfig.paths[`/auth/${elem}`]
                delete swaggerConfig.paths[`/auth/${elem}/callback*`]
            }
        });
    }

    // If Swagger is enabled then the router is enabled!
    if (config.swagger.enabled) {
        app.get(`/swagger.json`, (req, res) => res.json(swaggerConfig));
        app.use('/docs', express.static(`${config.base}/config/swaggerConfig/ui`));
    }
};

function errorHandler(err, req, res, next) {
    if (err) {
        console.log('err -------->',err)
        console.log("err -------- ", JSON.stringify(err));
        var error = {};
        if (err.result) {
            error = err;
        } else if (err.results && err.results.errors && err.results.errors[0] && err.results.errors[0].path) {
            error = {
                status: false,
                result: {
                    message: err.results.errors[0].path + " " + "is not valid"
                }
            }
        } else {
            error = {
                status: false,
                result: err
            }
        }
        res.status(err.statusCode || 500).send(error);
    }
}