// This will represent the User Controller (serves the Routes)
import LoginHandler from '../handler';


export const changePassword = (req, res) => {
    var loginHandler = new LoginHandler();
    loginHandler.changePassword(req, (result, statusCode) => {
        res.status(statusCode).send(result);
    });
}
