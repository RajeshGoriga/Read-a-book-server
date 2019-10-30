import statusCodes from '../../../config/statuscodes';
import utils from '../../../commons/utils/index';
import UserHandler from '../userManagement/handler';
import lodash from 'lodash';
import moment from 'moment';

export default class LoginHandler {
    constructor() {
    }

    /**
    * createLogin method will accept user login details and it will create login record
    * @param body contains valid username and password.
    * @author  Rajesh Goriga
    * @version 1.0
    */
    createLogin(userId, body, cb) {
        try {
            var userHandler = new UserHandler();
            var password = this.setPasswordExpiryDate(body.password);
            var object = {
                username: body.userName || body.email,
                password: password,
                userid: userId,
                createAt: moment().utc().toDate()
            };
            userHandler.getUserByID(userId, (uhResponse) => {
                if (!uhResponse.status) {
                    cb && cb(uhResponse, statusCodes.FORBIDDEN_REQUEST)
                    return;
                }
                global.dbController.insert('userlogin', object, (response) => {
                    if (response.status) {
                        var result = {
                            status: response.status,
                            result: { data: userId }
                        };
                        cb && cb(result, statusCodes.SUCCESSFULLY_CREATED)
                    } else {
                        cb && cb(response, statusCodes.FORBIDDEN_REQUEST)
                    }
                });
            })
        } catch (e) {
            console.log("error catched in createUser handler ", e);
            var error = {
                status: false,
                result: { message: e.message }
            };
            cb && cb(error, statusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    /**
    * changePassword method will change User password
    * @param currentPassword: currentPassword
    * @param updatedPassword: updatedPassword
    * @param cb : to return response
    * @author  Rajesh Goriga
    * @version 1.0
    */
    changePassword(req, cb) {
        try {
            var body = req.body;
            this.updatePassword(req.context.userid, body.newPassword, body.currentPassword, cb)
        } catch (e) {
            console.log("error catched in changePassword handler ", e.message);
            var error = {
                status: false,
                result: { message: e.message }
            };
            cb && cb(error, statusCodes.INTERNAL_SERVER_ERROR);
        }
    }


    updatePassword(userId, newPassword, oldPassword, cb) {
        try {
            // validate new password.
            if (!new LoginHandler().validatePassword(newPassword)) {
                var error = {
                    status: false,
                    result: { message: "Password must be minimum eight characters, at least one upper case letter, at least one lower case letter, at least one digit, at least one special character" }
                };
                cb && cb(error, statusCodes.FORBIDDEN_REQUEST);
                return;
            }
            var self = this;
            var userid = global.dbController.convertIdToObjectID(userId);
            global.dbController.findOne('userlogin', { userid: userid }, (response) => {
                if (!response.status) {
                    cb && cb(response, statusCodes.FORBIDDEN_REQUEST);
                    return;
                }
                const loginDetails = response.result.data;
                if (oldPassword) {
                    var verify = utils.verifyPasswordHash(oldPassword, loginDetails.password.hash);
                    if (!verify.status) {
                        cb && cb({ status: false, result: { message: "Current password mismatch" } }, statusCodes.FORBIDDEN_REQUEST);
                        return;
                    }
                }
                // Checking for password history
                if (self.checkPasswordHashDuplication(newPassword, loginDetails.password)) {
                    cb && cb({ status: false, result: { message: "New Password must not match previous 6 passwords." } }, statusCodes.FORBIDDEN_REQUEST);
                    return;
                }
                var password = self.generatePasswordObject(newPassword, loginDetails);
                self.updateUserLogin(userid, { password: password }, (userData) => {
                    if (userData.status) {
                        var result = {
                            status: response.status,
                            result: { data: "Password Updated Successfully" }
                        };
                        cb && cb(result, statusCodes.SUCCESSFULLY_CREATED)
                    } else {
                        cb && cb(response, statusCodes.FORBIDDEN_REQUEST)
                    }
                });
            });
        } catch (e) {
            console.log("error catched in updatePassword handler ", e.message);
            var error = {
                status: false,
                result: { message: e.message }
            };
            cb && cb(error, statusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    /**
    * validatePassword method will return true or false
    * @param password: Password provided by user
    * @author  Rajesh Goriga
    * @version 1.0
    */
    validatePassword(password) {
        try {
            var regularExpression = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
            if (regularExpression.test(password)) {
                return true;
            } else return false;
        } catch (e) {
            console.log("error catched in validatePassword handler ", e.message);
            return false;
        }
    }

    /**
    * updateUser method will return the selected user details
    * @param userId: Selected user _id
    * @param cb : to return response
    * @author  Rajesh Goriga
    * @version 1.0
    */
    updateUserLogin(userid, body, cb) {
        try {
            global.dbController.upsert('userlogin', { userid: userid }, body, (response) => {
                if (response.status) {
                    cb && cb(response, statusCodes.OK);
                } else {
                    cb && cb(response, statusCodes.FORBIDDEN_REQUEST);
                }
            });
        } catch (e) {
            console.log("error catched in updateUserLogin handler ", e.message);
            var error = {
                status: false,
                result: { message: e.message }
            };
            cb && cb(error, statusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    setPasswordExpiryDate(hash) {
        var password = {};
        password['hash'] = utils.createPasswordHash(hash);
        let expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + process.env.PASSWORD_EXPIRY_PERIOD /*days*/);
        password['expiresAt'] = expiryDate.getTime();
        password['history'] = [];
        return password;
    }

    checkPasswordHashDuplication(newPassword, password) {
        var history = password.history;
        var isFound = false;
        let verify = utils.verifyPasswordHash(newPassword, password.hash);
        if (verify.status) {
            return true;
        }
        for (let i = 0; i < history.length; i++) {
            verify = utils.verifyPasswordHash(newPassword, history[i]);
            if (verify.status) {
                return true;
            }
        }
        return false;
    }

    generatePasswordObject(newPassword, loginDetails) {
        var password = lodash.clone(loginDetails.password);
        var history = lodash.clone(password.history);
        var newHash = utils.createPasswordHash(newPassword);
        if (history.length == process.env.PASSWORD_HASH_LIMIT) {
            history.pop();
        }
        history.unshift(password.hash);
        password['hash'] = newHash;
        password['history'] = history;
        let expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + parseInt(process.env.PASSWORD_EXPIRY_PERIOD) /*days*/);
        password['expiresAt'] = expiryDate.getTime();
        return password;
    }
}