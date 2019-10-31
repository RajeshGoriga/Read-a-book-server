import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import config from '../../config/index';
import statusCodes from '../../config/statuscodes'
import utils from '../../commons/utils/index'
import UserHandler from '../../api/users/userManagement/handler';
import LoginHandler from '../../api/users/userLogin/handler';

/**
 * The LogHandler class handles complete authentication
 * @author  Rajesh Goriga
 * @version 1.0
 */
class AuthenticationHandler {
    constructor() {
        this.initalizeStrategies();
    }

    /**
     * The loginWithPassword method will validate username and password and give response 
     * @param req: express request object
     * @param res: express response object
     * @author  Rajesh Goriga
     * @version 1.0
     */
    loginWithPassword(req, res, next) {
        passport.authenticate('local', (err, response) => {
            //  Passport Error (If username or passwords are empty strings passport throwing it's own error)
            console.log("response:", response)
            if (response == false) {
                var result = {
                    message: "Invalid Username or Password"
                };
                res.status(statusCodes.UNAUTHORIZED_REQUEST).send({
                    status: false,
                    result: result
                });
                return;
            }

            if (!response.status) {
                res.status(statusCodes.UNAUTHORIZED_REQUEST).send(response);
            } else {
                console.log('response.result:', response.result);
                var token = utils.createJWTtoken(response.result, 'login');
                var result = {
                    data: {
                        userAuthToken: token
                    }
                };
                res.status(statusCodes.OK).send({
                    status: true,
                    result: result
                });
            }
        })(req, res, next);
    }

    /**
     * The initalizeStrategies method will initalize all the passport Strategies
     * @author  Rajesh Goriga
     * @version 1.0
     */
    initalizeStrategies() {
        if (config.authConfig.local) {
            this.initalizeLocalStrategy();
        }
    }

    /**
     * The initalizeLocalStrategy method will initalize local strategy
     * @author  Rajesh Goriga
     * @version 1.0
     */
    initalizeLocalStrategy() {
        var self = this;
        passport.use(new LocalStrategy(
            (username, password, done) => {
                self.authenticateUser(username, password, (result) => {
                    return done(null, result)
                });
            }
        ));
    }

    /**
     * The authenticateUser method will validate username and password from passport and respond
     * @param username: username to be validated
     * @param password: password to be verified
     * @param cb: callback to send response
     * @author  Rajesh Goriga
     * @version 1.0
     */
    authenticateUser(username, password, cb) {
        try {
            var self = this;
            if (username == "" || password == "") {
                cb && cb({ status: false, result: { message: "Invalid Username or Password" } });
                return;
            }
            var userHandler = new UserHandler();
            var loginHandler = new LoginHandler();
            userHandler.getUserByEmail(username, (userResponse) => {
                var userLoginDetails = null;
                var result = null;
                var passwordHash = null;
                if (!userResponse.status) {
                    cb && cb({ status: false, result: { message: "User Not Found" } });
                    return;
                }
                var userDetails = userResponse.result && userResponse.result.data;
                if (userDetails && !userDetails.isActive) {
                    cb && cb({ status: false, result: { message: "User Is InActive Please Consult Admin" } });
                    return;
                }

                    global.dbController.findOne('userlogin', { username: username }, (response) => {
                        if (!response.status) {
                            cb && cb({ status: false, result: { message: "Invalid Username or Password" } });
                            return;
                        }
                        userLoginDetails = response.result.data;
                        passwordHash = userLoginDetails.password.hash;
                        result = utils.verifyPasswordHash(password, passwordHash);
                        if (result.status) {
                            if (self.checkForPasswordExpiry(userLoginDetails)) {
                                loginHandler.sendPasswordExpiryToken(userLoginDetails, cb);
                                return;
                            }
                            cb && cb({ status: true, result: { userid: response.result.data.userid, userType: userResponse.result.data.userType } });
                        } else {
                            cb && cb(result);
                        }
                    });


            });
        } catch (e) {
            var error = { status: false, result: { message: e.message } };
            cb && cb(result);
        }
    }

    checkForPasswordExpiry(loginDetails) {
        var password = loginDetails.password;
        var currentTimeStamp = new Date().getTime();
        return (currentTimeStamp >= password.expiresAt);
    }
}

var loginHandler = new AuthenticationHandler();
export default loginHandler