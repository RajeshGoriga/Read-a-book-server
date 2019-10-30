import statuscodes from '../../config/statuscodes'
import lodash from 'lodash';

class AuthorizationHanlder {
    constructor() {
    }
    async authorizeRequest(req, authOrSecDef, cb) {
        console.log("inside authorizeRequest")
        try {
            return cb(null);
        } catch (e) {
            console.log("error catched in authorizeRequest:", e.message);
            cb({
                status: false,
                result: e.message,
                statusCode: statuscodes.INTERNAL_SERVER_ERROR
            });
        }
    }
}

var authorizationHanlder = new AuthorizationHanlder();
export default authorizationHanlder;