import config from '../../config/index';
const Razorpay = require('razorpay')

export default class PaymentRazorpay {
    constructor() {
        this.id = config.rzp.id
        this.secret = config.rzp.key

    }

    createRazorPayInstance() {
        var rzp = new Razorpay({
            key_id: this.id,
            key_secret: this.secret
        });
        return rzp;
    }

    /**
        * capture method will capture razorpay money 
        * @param paymentId: paymentId to capture payment
        * @param amount: amount to capture payment
        * @param cb : to return response
        * @author  Rajesh Goriga
        * @version 2.0
    */
    capture(paymentId, amount, cb) {
        var rzp = this.createRazorPayInstance();
        rzp.payments.capture(paymentId, amount).then((data) => {
            var result = {
                status: true,
                result: { data: data }
            }
            cb && cb(result);
        }).catch((error) => {
            console.log('error in payment captured', error)
            var result = {
                status: false,
                result: { message: error }
            }
            cb && cb(result);
        })
    }

    /**
        * refund method will refund  money 
        * @param paymentId: paymentId to capture payment
        * @param amount: amount to refund payment
        * @param cb : to return response
        * @author  Rajesh Goriga
        * @version 2.0
    */

    refund(paymentId, amount, cb) {      
       var rzp = this.createRazorPayInstance()        
     
       rzp.payments.refund(paymentId, {amount}).then((data) => {        
           var result = {     
               status: true,      
               result: { data: data }     
           }      
           cb && cb(result)       
           // success     
       }).catch((error) => {      
           console.log('error in payment refund', error)      
           var result = {     
               status: false,     
               result: { message: error }     
           }      
           cb && cb(result)       
           // error       
       })     
   }
}
