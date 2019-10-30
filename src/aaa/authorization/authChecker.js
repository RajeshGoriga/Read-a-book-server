import utils from '../../commons/utils/index';
// import UserHandler from '../../api/users/userManagement/handler';
import statuscodes from '../../config/statuscodes'

class AuthChecker {
    constructor() {
    }

    async getUserContext(req, authOrSecDef, token, cb) {
        console.log('Inside getUserContext');
        var error = {
            status: false,
            result: { message: "Invalid Token", isInvalidToken: true },
            statusCode: statuscodes.UNAUTHORIZED_REQUEST
        };

        if (!token) {
            return cb(error);
        }

        //Verify Token
        utils.asyncverifyJWTtoken(token, 'login', (response) => {
            console.log("asyncverifyJWTtoken\n");
            if (!response.status) {
                console.log("222 asyncverifyJWTtoken \n");
                return cb(error);
            }
            var userHandler = new UserHandler();
            var contextuserid = response.result.userid;
            req.context = { userid: contextuserid, userType: response.result.userType };
            userHandler.getUserByID(contextuserid, (response) => {
                if (response.status) {
                    var userData = response.result.data;
                    if (userData.isActive) {

                        return cb(null);
                    } else {
                        cb(error);
                    }
                } else {
                    error.result.userNotFound = true;
                    return cb(error);
                }
            });

        });
    }

    async checkStatus(req, authOrSecDef, cb) {
        console.log('Inside Check Status');
        var error = {
            status: false,
            result: { message: "Un Authorized Request" },
            statusCode: statuscodes.UNAUTHORIZED_REQUEST
        };

        try {
            var contextuserid = req.context.userid;
            var userHandler = new UserHandler();
            userHandler.getUserByID(contextuserid, (response) => {
                if (response.status) {
                    var userData = response.result.data;
                    // console.log("userData -------- ", userData)
                    if (userData.userType == 'admin') return cb(null);
                    if (userData.isActive) {
                        return cb(null);
                    } else {
                        cb({
                            status: false,
                            result: { message: "In Active User" },
                            statusCode: statuscodes.INTERNAL_SERVER_ERROR
                        });
                    }

                } else {
                    error.result.userNotFound = true;
                    return cb(error);
                }
            });
        } catch (e) {
            console.log("error catched in checkStatus: ", e.message);
            cb({
                status: false,
                result: e.message,
                statusCode: statuscodes.INTERNAL_SERVER_ERROR
            });
        }
    }
}

var authChecker = new AuthChecker();
export default authChecker;