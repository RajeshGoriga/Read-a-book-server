import LoginHandler from '../userLogin/handler';
import statusCodes from '../../../config/statuscodes';

export default class UserHandler {
    constructor() { }

    /**
     * createUser method will accept input as userparameters
     * @param body: User Details to create a record
     * @param cb : to return response
     * @author  Rajesh Goriga
     * @version 1.0
     */
    createUser(body, cb) {
        try {
            // Password Validation
            if (!new LoginHandler().validatePassword(body.password)) {
                var error = {
                    status: false,
                    result: { message: "Password must be minimum eight characters, at least one upper case letter, at least one lower case letter, at least one digit, at least one special character" }
                };
                cb && cb(error, statusCodes.FORBIDDEN_REQUEST);
                return;
            }

            global.dbController.insert('users', body, (userData) => {
                if (userData.status) {
                    cb && cb(userData, statusCodes.SUCCESSFULLY_CREATED);
                } else {
                    cb && cb(userData, statusCodes.FORBIDDEN_REQUEST);
                }
            });
        } catch (e) {
            console.log("error catched in createUser handler ", e.message);
            var error = {
                status: false,
                result: {
                    message: e.message
                }
            }
            cb && cb(error, statusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * getUsers method will return list of users
     * @param params: limit and offset for paginition
     * @param cb : to return response
     * @author  Rajesh Goriga
     * @version 1.0
     */
    getUsers(params, cb) {
        try {
            global.dbController.find('users', {}, params, (response) => {
                if (response.status) {
                    cb && cb(response, statusCodes.OK);
                } else {
                    cb && cb(response, statusCodes.FORBIDDEN_REQUEST);
                }
            });
        } catch (e) {
            console.log("error catched in getUsers handler ", e.message);
            var error = {
                status: false,
                result: {
                    message: e.message
                }
            }
            cb && cb(error, statusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * getUserByID method will return the selected user details
     * @param userid: Selected user id
     * @param cb : to return response
     * @author  Rajesh Goriga
     * @version 1.0
     */
    getUserByID(userid, cb) {
        try {
            global.dbController.findOne('users', {
                _id: global.dbController.convertIdToObjectID(userid)
            }, (response) => {
                if (response.status) {
                    cb && cb(response, statusCodes.OK);
                } else {
                    cb && cb(response, statusCodes.FORBIDDEN_REQUEST);
                }
            });
        } catch (e) {
            console.log("error catched in getAccountByID handler ", e.message);
            var error = {
                status: false,
                result: {
                    message: e.message
                }
            };
            cb && cb(error, statusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * getUserByEmail method will return the selected user details
     * @param email: Selected user email
     * @param cb : to return response
     * @author  Rajesh Goriga
     * @version 1.0
     */
    getUserByEmail(email, cb) {
        try {
            global.dbController.findOne('users', {
                email: email
            }, (response) => {
                if (response.status) {
                    cb && cb(response, statusCodes.OK);
                } else {
                    cb && cb(response, statusCodes.FORBIDDEN_REQUEST);
                }
            })
        } catch (e) {
            console.log("error catched in getUserByEmail handler ", e.message);
            var error = {
                status: false,
                result: {
                    message: e.message
                }
            };
            cb && cb(error, statusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * updateUser method will return the selected user details
     * @param userId: Selected user _id
     * @param cb : to return response
     * @author  Rajesh Goriga
     * @version 1.0
     */
    updateUser(userId, body, cb) {
        try {
            global.dbController.update('users', {
                _id: userId
            }, body, (response) => {
                if (response.status) {
                    cb && cb(response, statusCodes.OK);
                } else {
                    cb && cb(response, statusCodes.FORBIDDEN_REQUEST);
                }
            });
        } catch (e) {
            console.log("error catched in updateUser handler ", e.message);
            var error = {
                status: false,
                result: {
                    message: e.message
                }
            };
            cb && cb(error, statusCodes.INTERNAL_SERVER_ERROR);
        }
    }

}