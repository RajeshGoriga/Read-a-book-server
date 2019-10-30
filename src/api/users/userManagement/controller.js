// This will represent the User Controller (serves the Routes)
import UserHandler from './handler';
import LoginHandler from '../userLogin/handler';
import statusCodes from '../../../config/statuscodes';
import moment from 'moment';

export const registerUser = (req, res) => {
    try {
        console.log("registerUser request 1 \n");
        var userHandler = new UserHandler();
        var loginHandler = new LoginHandler();
        var body = req.body;
        body.userType = "user";
        body.email = (body.email && body.email.toLowerCase()) || (body.userName && body.userName.toLowerCase());
        body.userName = (body.userName && body.userName.toLowerCase()) || (body.email && body.email.toLowerCase());
        body.createAt = moment().utc().toDate();
        userHandler.createUser(body, (response, statusCode) => {
            if (response.status) {
                console.log("userHandler.createUser success 2 \n");
                loginHandler.createLogin(response.result.data, req.body, async (result, statusCode) => {
                    var userid = response.result.data;
                    if (result.status) {
                        console.log("loginHandler.createLogin success 3 \n");
                        response.result = { data: { userid: userid } };
                        res.status(statusCode).send(response);
                    } else {
                        console.log("loginHandler.createLogin failure 3 \n");
                        res.status(statusCode).send(response);
                    }
                });
            } else {
                console.log("userHandler.createUser failure 2 \n");
                res.status(statusCode).send(response);
            }
        });
    } catch (e) {
        console.log("Error catched in registerUser method ", e);
        var response = {};
        response.status = false;
        response.result = { message: "Internal Server Error" };
        res.status(statusCodes.INTERNAL_SERVER_ERROR).send(response);
    }
}


// TODO: This method need to add permission only admin can call this method.
export const createUser = (req, res) => {
    var userHandler = new UserHandler();
    var loginHandler = new LoginHandler();
    userHandler.createUser(req.body, (response, statusCode) => {
        if (response.status) {
            loginHandler.createLogin(response.result, req.body, (result, statusCode) => {
                if (result.status)
                    userHandler.sendVerificationEmail(response.result.data);



                res.status(statusCode).send(result);
            });
        } else {
            res.status(statusCode).send(response);
        }
    });
}

export const getUsers = (req, res) => {
    var userHandler = new UserHandler();
    userHandler.getUsers(req.query, (result, statusCode) => {
        res.status(statusCode).send(result);
    });
}

export const getUserByID = (req, res) => {
    var userHandler = new UserHandler();
    var userid = req.swagger.params.userid.value;
    userHandler.getUserByID(userid, (result, statusCode) => {
        res.status(statusCode).send(result);
    });
}

export const getUserByEmail = (req, res) => {
    var userHandler = new UserHandler();
    var email = req.swagger.params.email.value;
    userHandler.getUserByEmail(email, (result, statusCode) => {
        res.status(statusCode).send(result);
    });
}

export const getUserDetails = (req, res) => {
    var userHandler = new UserHandler();
    var userid = req.context.userid;
    userHandler.getUserByID(userid, (result, statusCode) => {
        res.status(statusCode).send(result);
    });
}


export const activateUser = (req, res) => {
    var userHandler = new UserHandler();
    var body = {
        isActive: true
    }
    var userid = req.swagger.params.userid.value;
    userHandler.updateUser(userid, body, (result, statusCode) => {
        res.status(statusCode).send(result);
    });
}



export const inActivateUser = (req, res) => {
    var userHandler = new UserHandler();
    var body = {
        isActive: false
    }
    var userid = req.swagger.params.userid.value;
    userHandler.updateUser(userid, body, (result, statusCode) => {
        res.status(statusCode).send(result);
    });
}