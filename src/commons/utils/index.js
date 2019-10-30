import jwt from 'jsonwebtoken'
import otplib from 'otplib';

const bcrypt = require('bcrypt');
var TOTAL_PWD_ROUNDS = 10;


class Utils {
	constructor() { }


	/**
	 * The createJWTtoken method will create Json Web Token for apikey/login 
	 * @param doc: details need to encrypt in the token
	 * @author  Rajesh Goriga
	 * @version 1.0
	 */
	createJWTtoken(details, subject) {
		// NOTE: Madhu 
		// Remove expiration time on the user auth token

		if (subject == "forgotpassword") {
			return jwt.sign(details, process.env.JWT_SECRET, { expiresIn: 5 * 60 , subject: subject });			
		} else {
			return jwt.sign(details, process.env.JWT_SECRET, {  subject: subject });			
		}
		// return jwt.sign(details, process.env.JWT_SECRET, { expiresIn: '1h', subject: subject });
	}

	/**
	 * The verifyJWTtoken method will Verify Json Web Token 
	 * @param token: JWT token need to verify
	 * @author  Rajesh Goriga
	 * @version 1.0
	 */
	async verifyJWTtoken(token, subject) {
		if (!token)
			return ({
				status: false,
				result: { message: 'Invalid Token', isInvalidToken: true }
			});

		const result = await new Promise(function (resolve) {
			jwt.verify(token, process.env.JWT_SECRET, { subject: subject }, function (err, decoded) {
				if (err || decoded == null)
					resolve({
						status: false,
						result: { message: err }
					})
				else {
					resolve(({
						status: true,
						result: decoded
					}))
				}
			});
		});
		return result;
	}

	asyncverifyJWTtoken(token, subject, cb) {
		if (!token)
			cb && cb ({
				status: false,
				result: { message: 'Invalid Token', isInvalidToken: true }
			});

		// const result = await new Promise(function (resolve) {
			jwt.verify(token, process.env.JWT_SECRET, { subject: subject }, function (err, decoded) {
				if (err || decoded == null)
					cb && cb({
						status: false,
						result: { message: err }
					})
				else {
					cb && cb({
						status: true,
						result: decoded
					})
				}
			});
		// })
		// return result;
	}

	/**
	 * The createPasswordHash method will encrypt password
	 * @param pwd: PWD that needs to be hashed
	 * @author  Rajesh Goriga
	 * @version 1.0
	 */
	generatePassword() {
		return Math.random().toString(36).substring(3);
	}

	/**
	 * The createPasswordHash method will encrypt password
	 * @param pwd: PWD that needs to be hashed
	 * @author  Rajesh Goriga
	 * @version 1.0
	 */
	createPasswordHash(pwd) {
		return bcrypt.hashSync(pwd, TOTAL_PWD_ROUNDS);
	}

	/**
	 * The verifyPasswordHash method will compare encrypted pwd with hash from DB in 
	 * @param pwd: PWD hash that needs to be verified
	 * @param hash: hash that needs to be compared
	 * @author  Rajesh Goriga
	 * @version 1.0
	 */
	verifyPasswordHash(pwd, hash) {
		if (!pwd || !hash)
			return {
				status: false,
				result: { message: "Invalid Username or Password" }
			};

		if (bcrypt.compareSync(pwd, hash)) {
			return {
				status: true
			}
		} else {
			return {
				status: false,
				result: { message: "Invalid Username or Password" }
			};
		}
	}

	/**
	 * The generateOTP method will generate 6 digit stateless otp by using a secret 
	 * @param secret: secret to generate otp
	 * @author  Rajesh Goriga
	 * @version 1.0
	 */
	generateOTP(secret) {
		otplib.authenticator.options = { step: process.env.OTP_SETP_TIME };
		return otplib.authenticator.generate(secret);
	}

	/**
	 * The verifyOTP method will verify given otp with given secret 
	 * @param secret: secret to verify otp
	 * @param otp: otp that need to be verified
	 * @author  Rajesh Goriga
	 * @version 1.0
	 */
	verifyOTP(secret, otp) {
		return otplib.authenticator.check(parseInt(otp), secret);
	}

	/**
	 * The secondsToHms method will convert seconds to Hours-Minutes-Seconds 
	 * @param d: number of seconds
	 * @author  Pradeep
	 * @version 1.0
	 */
	secondsToHms(d) {
		d = Number(d);
		var h = Math.floor(d / 3600);
		var m = Math.floor(d % 3600 / 60);
		var s = Math.floor(d % 3600 % 60);

		var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
		var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
		var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
		return hDisplay + mDisplay + sDisplay; 
	}
}

var utils = new Utils();
export default utils;