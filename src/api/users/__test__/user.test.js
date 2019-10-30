import { expect, assert } from 'chai';

import User from '../userManagement/user';
const user = new User();


describe('User Schema', function () {

    it('should be invalid if email is empty', (done) => {
        user.validate((err) => {
            expect(err.errors.email).to.exist;
            done();
        })
    })

    it('should be invalid if email is invalid', (done) => {
        user.email = "test"
        user.validate((err) => {
            expect(err.errors.email).to.exist;
            done();
        })
    })
});