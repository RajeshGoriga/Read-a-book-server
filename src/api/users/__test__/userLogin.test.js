import { expect, assert } from 'chai';

import UserLogin from '../userLogin/userLogin';
const userLogin = new UserLogin();

describe('User Login Schema', function () {

    it('should be invalid if userid is empty', (done) => {
        userLogin.validate((err) => {
            expect(err.errors.userid).to.exist;
            done();
        })
    })

    it('should be invalid if username is empty', (done) => {
        userLogin.validate((err) => {
            expect(err.errors.username).to.exist;
            done();
        })
    })

    it('should be invalid if password is empty', (done) => {
        userLogin.validate((err) => {
            expect(err.errors.password).to.exist;
            done();
        })
    })

    it('should be invalid if userid is invalid ', (done) => {
        userLogin.userid = "efsd"
        userLogin.validate((err) => {
            expect(err.errors.userid).to.exist;
            done();
        })
    })
});