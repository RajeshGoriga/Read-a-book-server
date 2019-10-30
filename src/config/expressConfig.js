import helmet from 'helmet'
import bodyParser from 'body-parser';
import compression from 'compression';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import config from './index';
import passport from 'passport'
import fileUpload from 'express-fileupload';

export const expressConfig = (app) => {


    app.use(function(req, res, next) {
      // res.header("Access-Control-Allow-Origin", 'http://locahost:8001');
      res.header("Access-Control-Allow-Origin", '*');
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-Access-Token");
      next();
    });    


    app.use(bodyParser.json({ limit: '5mb' }));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(methodOverride());  //Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it.
    app.use(compression()); //The middleware will attempt to compress response bodies for all request 
    app.use(helmet()); //Helmet helps you secure your Express apps by setting various HTTP headers
    
    app.use(cors({ origin: true, credentials: true }));  // Has to be more detailed;; NEEDS MORE INPUTS

    app.use(passport.initialize());
    app.use(passport.session()); // Needs to be discussed and removed.
    app.use(fileUpload()); // Where is formiddable
    if (config.log) {
        app.use(morgan('dev')); // Provide the response time, and other logs
    }
    
    app.use(helmet.hidePoweredBy({ setTo: 'READABOOK' })); // Needs to be tested. 
}