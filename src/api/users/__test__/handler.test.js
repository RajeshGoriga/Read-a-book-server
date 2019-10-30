import { expect, assert } from 'chai';
import LoginHandler from '../userLogin/handler';
import UserHandler from '../userManagement/handler';

const userHandler = new UserHandler();
const loginHandler = new LoginHandler();
var userid = "";
var token = "";
var resettoken = "";
var otp = null;

describe('UserHandler', function () {
    before(() => { });
    after(() => { });

    describe('createUser', function () {
        it('createUser should return true status with valid data', (done) => {
            var body = {
                name: "Tester",
                mobileNumber: "9985786859",
                email: "gorigarajesh@gmail.com",
                userName: "Test1",
                password: "test",
                confirmPassword: "test",
                isTCAggred: true
            };
            userHandler.createUser(body, (response) => {
                global.userid = userid = response.result.data;
                assert.equal(true, response.status);
                done();
            });
        });

        it('createUser should return false status with duplicate valid data', (done) => {
            var body = {
                name: "Tester",
                mobileNumber: "97111",
                email: "gorigarajesh@gmail.com",
                userName: "Test1",
                password: "test",
                confirmPassword: "test",
                isTCAggred: true
            }
            userHandler.createUser(body, (result) => {
                assert.equal(false, result.status);
                done();
            });
        });

        it('createUser should return false status with  empty data', (done) => {
            var body = {
                name: "",
                mobileNumber: "",
                email: "gorigarajesh@gmail.com",
                userName: "",
                password: "",
                confirmPassword: "test",
                isTCAggred: true
            }
            userHandler.createUser(body, (result) => {
                assert.equal(false, result.status);
                done();
            });
        });

        it('createUser should return false status with invalid data', (done) => {
            var body = {
                name: "Tester2",
                mobileNumber: 971111,
                email: "user1.com",
                userName: "Test2",
                password: "test2",
                confirmPassword: "test2",
                isTCAggred: "true"
            }
            userHandler.createUser(body, (result) => {
                assert.equal(false, result.status);
                done();
            });
        });

        it('createUser should return false response when dbcontroller is null', async (done) => {
            var dbController = global.dbController;
            global.dbController = null;
            userHandler.createUser({}, (result) => {
                assert.equal(false, result.status);
                global.dbController = dbController;
                done();
            });
        });
    });

    describe('updateUser', function () {
        it('updateUser should return true status with valid body and userid', (done) => {
            var body = {
                name: "UpdatedTester",
                mobileNumber: "971114",
                email: "gorigarajesh@gmail.com",
                userName: "Test2",
                password: "test2",
                confirmPassword: "test2",
                isTCAggred: true
            }
            userHandler.updateUser(userid, body, (result) => {
                assert.equal(true, result.status);
                done();
            });
        });

        it('updateUser should return false status with valid body and invalid userid', (done) => {
            var body = {
                name: "",
                mobileNumber: "",
                email: "gorigarajesh@gmail.com",
                userName: "Test2",
                password: "test2",
                confirmPassword: "test2",
                isTCAggred: true
            }
            userHandler.updateUser("5a3123baf8681b8626f4672e", body, (result) => {
                assert.equal(false, result.status);
                done();
            });
        });

        it('updateUser should return false response when dbcontroller is null', async (done) => {
            var dbController = global.dbController;
            global.dbController = null;
            userHandler.updateUser(userid, {}, (result) => {
                assert.equal(false, result.status);
                global.dbController = dbController;
                done();
            });
        });
    });

    describe('getUserByID', function () {
        it('getUserByID should return user details with valid userid', (done) => {
            userHandler.getUserByID(userid, (result) => {
                assert.equal(true, result.status);
                done();
            });
        });

        it('getUserByID should return false with Invalid userid', (done) => {
            userHandler.getUserByID("5a314f07acf94783fb990ca4", (result) => {
                assert.equal(false, result.status);
                done();
            });
        });

        it('getUserByID should return false response when dbcontroller is null', async (done) => {
            var dbController = global.dbController;
            global.dbController = null;
            userHandler.getUserByID("5a314f07acf94783fb990ca4", (result) => {
                assert.equal(false, result.status);
                global.dbController = dbController;
                done();
            });
        });

    })

    describe('getUserByEmail', function () {
        it('getUserByEmail should return user details with valid email', (done) => {
            userHandler.getUserByEmail("gorigarajesh@gmail.com", (result) => {
                assert.equal(true, result.status);
                done();
            })
        });
        it('getUserByEmail should return false status with Invalid email', (done) => {
            userHandler.getUserByEmail("wronge@xyz.com", (result) => {
                assert.equal(false, result.status);
                done();
            })
        });

        it('getUserByEmail should return false response when dbcontroller is null', async (done) => {
            var dbController = global.dbController;
            global.dbController = null;
            userHandler.getUserByEmail("gorigarajesh@gmail.com", (result) => {
                assert.equal(false, result.status);
                global.dbController = dbController;
                done();
            });
        });
    });

    describe('getUsers', function () {
        it('getUsers should return users details with the valid data', (done) => {
            var param = {
                offset: '0',
                limit: '12'
            }
            userHandler.getUsers(param, (result) => {
                assert.equal(true, result.status);
                done();
            });
        })

        it('getUsers should return false status with the in valid data', (done) => {
            var param = {
                offset: '-1',
                limit: '-1'
            }
            userHandler.getUsers(param, (result) => {
                assert.equal(false, result.status);
                done();
            });
        })

        it('getUsers should return false response when dbcontroller is null', async (done) => {
            var dbController = global.dbController;
            var param = {
                offset: '-1',
                limit: '-1'
            }
            global.dbController = null;
            userHandler.getUsers(param, (result) => {
                assert.equal(false, result.status);
                global.dbController = dbController;
                done();
            });
        });
    });

    describe('sendVerificationEmail', function () {
        // need to verify this use case properly 
        it('sendVerificationEmail should return true status with valid userid', (done) => {
            userHandler.sendVerificationEmail(userid, (response) => {
                token = response.result;
                assert.equal(true, response.status);
                done();
            });
        })

        it('sendVerificationEmail should return false status with invalid userid', (done) => {
            userHandler.sendVerificationEmail("5a314f07acf94783fb990ca4", (result) => {
                assert.equal(false, result.status);
                done();
            });
        })
    });

    describe('verifyEmail', function () {
        it('verifyEmail should return true response on valid arguments', (done) => {
            userHandler.verifyEmail(token, (result) => {
                assert.equal(true, result.status);
                done();
            });
        })

        it('verifyEmail should return false response on in valid arguments', (done) => {
            token = "sss";
            userHandler.verifyEmail(token, (result) => {
                assert.equal(false, result.status);
                done();
            });
        })
    });

    describe('sendotp', function () {
        it('sendotp should return true status on valid arguments', (done) => {
            var body = {
                userid: userid
            }
            userHandler.sendotp(body, (response) => {
                console.log("response", response);
                otp = response.otp;
                assert.equal(true, response.status);
                done();
            });
        })

        it('sendotp should return false status on invalid arguments', (done) => {
            userHandler.sendotp({}, (result) => {
                assert.equal(false, result.status);
                done();
            });
        })

        it('sendotp should return false status on invalid arguments', (done) => {
            var body = {
                userid: ''
            }
            userHandler.sendotp(body, (result) => {
                assert.equal(false, result.status);
                done();
            });
        })
    });

    describe('verifyotp', function () {
        it('verifyotp should return true status on valid arguments', (done) => {
            var body = {
                userid: userid,
                otp: otp
            }
            userHandler.verifyotp(body, (result) => {
                assert.equal(true, result.status);
                done();
            });
        })
        it('sendotp should return false status on invalid otp', (done) => {
            var body = {
                userid: '5a3123b95934de73f1514ed5',
                otp: ''
            }
            userHandler.verifyotp(body, (result) => {
                assert.equal(false, result.status);
                done();
            });
        })

        it('sendotp should return false status on invalid arguments', (done) => {
            var body = {
                userid: '',
                otp: ''
            }
            userHandler.verifyotp(body, (result) => {
                assert.equal(false, result.status);
                done();
            });
        })
    });

    describe('updateConsent', function () {
        it('updateConsent should return true response on valid body', (done) => {
            var body = {
                userid: userid,
                firstName: "venkata",
                lastName: "pindiproli"
            }
            userHandler.updateConsent(body, (response) => {
                assert.equal(true, response.status);
                done();
            });
        })

        it('updateConsent should return false response on if it is verified', (done) => {
            var body = {
                userid: userid,
                firstName: "venkata",
                lastName: "pindiproli"
            }
            userHandler.updateConsent(body, (response) => {
                assert.equal(false, response.status);
                done();
            });
        })

        it('updateConsent should return false response when dbcontroller is null', (done) => {
            var dbController = global.dbController;
            global.dbController = null;
            var body = {
                userid: userid,
                firstName: "venkata",
                lastName: "pindiproli"
            }
            userHandler.updateConsent(body, (response) => {
                assert.equal(false, response.status);
                global.dbController = dbController;
                done();
            });
        });
    });
});

describe('Login Handler', () => {
    describe('createLogin', () => {
        it('createLogin should return true status with in valid userid', (done) => {
            var body = {
                userName: "Test1",
                password: "test"
            }

            loginHandler.createLogin(userid, body, (result) => {
                assert.equal(true, result.status);
                done();
            })
        });

        it('createLogin should return false status with in invalid userid', (done) => {
            var body = {
                userName: "Test1",
                password: "test"
            }

            loginHandler.createLogin("5a3123baf8681b8626f4672e", body, (result) => {
                assert.equal(false, result.status);
                done();
            })
        });

        it('createLogin should return false status when dbcontroller is null', (done) => {
            var dbController = global.dbController;
            global.dbController = null;

            var body = {
                userName: "Test1",
                password: "test"
            }

            loginHandler.createLogin("5a3123b95934de73f1515fe8", body, (result) => {
                assert.equal(false, result.status);
                global.dbController = dbController;
                done();
            })
        });
    });

    describe('sendResetPasswordLink', () => {
        it('sendResetPasswordLink should return true status with in valid email', (done) => {
            var body = {
                email: "gorigarajesh@gmail.com"
            }
            loginHandler.sendResetPasswordLink(body, (response) => {
                resettoken = response.token
                console.log("resettoken", resettoken)
                assert.equal(true, response.status);
                done();
            })
        });

        it('sendResetPasswordLink should return false status with in invalid email', (done) => {
            var body = {
                email: "Rajesh Goriga@gmail.com"
            }

            loginHandler.sendResetPasswordLink(body, (result) => {
                assert.equal(false, result.status);
                done();
            })
        });

        it('sendResetPasswordLink should return false status when dbcontroller is null', (done) => {
            var dbController = global.dbController;
            global.dbController = null;
            var body = {
                email: "gorigarajesh@gmail.com"
            }
            loginHandler.sendResetPasswordLink(body, (result) => {
                assert.equal(false, result.status);
                global.dbController = dbController;
                done();
            });
        });
    });

    describe('resetPassword', () => {
        it('resetPassword should return true status with in valid body', (done) => {
            var body = {
                token: resettoken,
                password:'Rajesh Goriga@63'
            }
            loginHandler.resetPassword(body, (response) => {
                assert.equal(true, response.status);
                done();
            })
        });

        it('resetPassword should return false status with in valid token', (done) => {
            var body = {
                token: token,
                password:'Rajesh Goriga@63'
            }
            loginHandler.resetPassword(body, (response) => {
                assert.equal(false, response.status);
                done();
            })
        });

        it('resetPassword should return false status with in empty token', (done) => {
            var body = {
                token: '',
                password:'Rajesh Goriga@63'
            }
            loginHandler.resetPassword(body, (response) => {
                assert.equal(false, response.status);
                done();
            })
        });

        it('resetPassword should return false status when dbcontroller is null', (done) => {
            var dbController = global.dbController;
            global.dbController = null;

            var body = {
                token: resettoken,
                password:'Rajesh Goriga@63'
            }

            loginHandler.resetPassword(body, (result) => {
                assert.equal(false, result.status);
                global.dbController = dbController;
                done();
            })
        });
    });
});