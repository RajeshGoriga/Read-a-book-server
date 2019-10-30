import mongoose from 'mongoose';
import timestamps from 'mongoose-timestamp';
const Schema = mongoose.Schema;

const userLoginSchema = new Schema({

    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },

    username: {
        type: String,
        required: [true, 'Username is required.'],
        unique: true
    },

    password: {
        hash: {
            type: String,
            required: true,
        },

        expiresAt: {
            type: String,
            required: true
        },

        history: [{
            type: String,
            validate: {
                validator: function (val) {
                    return val.length <= process.env.PASSWORD_HASH_LIMIT;
                },
                message: 'Array exceeds max size.'
            }
        }]
    }
});

userLoginSchema.plugin(timestamps);
export default mongoose.model('userlogin', userLoginSchema, 'userlogin');