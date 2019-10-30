import PaymentRazorpay from '../paymentRazorpay'
import {
    expect,
    assert
} from 'chai';
const paymentRazorpay = new PaymentRazorpay();


describe('paymentRazorpay', function () {
    describe('capture', function () {
        it('capture should return status true valid arguments', () => {
            var paymentId = "pay_9L8C3KJxhqHnoU";
            var amount = 49900;
            paymentRazorpay.capture(paymentId,amount, (result) => {
                console.log('result', result)
                assert.equal(true, result.status);
                // done();
            })
        });
    })

    describe('capture', function () {
        it('capture should return status false invalid arguments', () => {
            var paymentId = "pay_9L8C3KJxhqHnoU";
            var amount = 490;
            paymentRazorpay.capture(paymentId, amount, (result) => {
                assert.equal(false, result.status);
                // done();
            })
        });
    })

    describe('refund', function () {
        it('refund should return status true valid arguments', () => {
            var paymentId = "pay_9L8C3KJxhqHnoU";
            var amount = 49900;
            paymentRazorpay.capture(paymentId,amount, (result) => {
                console.log('result', result)
                assert.equal(true, result.status);
                // done();
            })
        });
    })

    describe('refund', function () {
        it('refund should return status false invalid arguments', () => {
            var paymentId = "pay_9L8C3KJxhqHnoU";
            var amount = 490;
            paymentRazorpay.capture(paymentId, amount, (result) => {
                assert.equal(false, result.status);
                // done();
            })
        });
    })

   
});