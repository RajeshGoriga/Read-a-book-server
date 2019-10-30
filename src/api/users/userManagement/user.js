import mongoose from 'mongoose';
import moment from 'moment'
const Schema = mongoose.Schema;
const beautifyUnique = require('mongoose-beautiful-unique-validation');

const userSchema = new Schema({
    firstName: {
        type: String,
        required: false
    },
    
    middleName: {
        type: String,
        required: false
    },

    lastName: {
        type: String,
        required: false
    },

    name: {
        type: String,
        required: false
    },

    email: {
        type: String,
        required: [true, 'email is required.'],
        unique: 'Email Already Exist',
        match: [/^((([a-zA-Z]|[0-9])|([-]|[_]|[.])){2,})+[@](([a-zA-Z0-9])|([-]|[.])){2,20}[.]((([a-zA-Z0-9]){2,4})|(([a-zA-Z0-9]){2,4}[.]([a-zA-Z0-9]){2,4}))$/, "Please Enter Valid Email"],
        maxlength: [50, 'Email length should be maximum of 50 characters'],
        index: { unique: true }
    },

    mobileNumber: {
        type: String,
        match: [/^[1-9][0-9]{9,14}$/, "Please Enter Valid Mobile Number"],
        required: false
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    createAt: {
        type: Date,
        default: moment().utc().toDate(),
        required: true
    },

    updatedAt: {
        type: Date,
        default: moment().utc().toDate(),
        required: true
    },

    userType: {
        type: String,
        required: false
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

// userSchema.index({ email: 1 }, { unique: true });
userSchema.plugin(beautifyUnique);

require('./hook').default(userSchema);

export default mongoose.model('users', userSchema, 'users');