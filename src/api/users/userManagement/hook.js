import { Error } from "mongoose";
import Joi from 'joi';

export default (users) => {

    users.pre('save', async function (next) {
            var user = {
                name: this.name,
                mobileNumber: this.mobileNumber,
                email: this.email,
                emailVerified: this.emailVerified,
            }
            // mobileNumber: Joi.number().min(10).max(10).required(),
            const schema = Joi.object().keys({
                name: Joi.string().required(),
                email: Joi.string().required(),
                mobileNumber: Joi.string(),
                emailVerified: Joi.boolean()
            }).with('name', 'email');
            const result = Joi.validate(user, schema);
            if (result && result.error != null) {
                var error = result.error.details[0].message;
                console.log("result.error", error);
                next(new Error(error))
            } else {
                next();
            }
    });
}