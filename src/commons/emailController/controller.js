import nodemailer from 'nodemailer';
import nodemailerMock from 'nodemailer-mock';
import statusCodes from '../../config/statuscodes';
import fs from 'fs';

class EmailController {
    constructor() {
        this.options = {
            host: process.env.EMAIL_HOST || 'smtp.mailgun.org',
            port: process.env.EMAIL_PORT || '587',
            auth: {
                user: process.env.EMAIL_USER_NAME || 'postmaster@mg.instavc.com',
                pass: process.env.EMAIL_PWD || 'Ajarsun123',
            },
            tls: {
                rejectUnauthorized: false
            }
        }
    }

    /**
   * createEmailTransport method will initalize the transport using nodemailer and given options 
   * @author  Rajesh Goriga
   * @version 6.0
   */
    createEmailTransport() {
        return nodemailer.createTransport(this.options);
    }

    /**
    * sendEmail method will create the transport, cook the required payload and send the email provided in touserId
    * @param payload : details to send email
     * @author  Rajesh Goriga
     * @version 2.0
    */
    sendEmail(payload, cb) {
        var transporter = this.createEmailTransport();

        if (process.env.NODE_ENV == 'test') {
            var transporter = nodemailerMock.createTransport(this.options);
        }

        transporter.verify((err, success) => {
            if (err) {
                console.error('error in email transporter verification:', err);
                cb && cb({ status: false, result: "Internal Server Error" });
            } else {
                // Server is ready to take our messages.
                var mailOptions = {
                    from: payload.from,             // sender address.
                    to: payload.to,                 // list of receivers.
                    subject: payload.subject,       // Subject line.
                    text: payload.message,          // plain text body.
                    html: payload.template          // html body.
                };

                // send mail with defined transport object.
                transporter.sendMail(mailOptions, function (err, info) {
                    if (err) {
                        console.error('error in sendMail :', err);
                        cb && cb({ status: false, result: "Internal Server Error" }, statusCodes.INTERNAL_SERVER_ERROR);
                    }
                    else {
                        console.log('Mail Sent Successfully');
                        cb && cb({ status: true, result: "Mail Sent Successfully" }, statusCodes.OK);
                    }
                });
            };
        });
    }

    /**
    * sendEmailWithAttachement method will create the transport, cook the required payload and send the email provided in touserId
    * @param payload : details to send email
     * @author  Rajesh Goriga
     * @version 2.0
    */
    sendEmailWithAttachement(payload, cb) {
        var transporter = this.createEmailTransport();

        if (process.env.NODE_ENV == 'test') {
            var transporter = nodemailerMock.createTransport(this.options);
        }

        transporter.verify((err, success) => {
            if (err) {
                console.error('error in email transporter verification:', err);
                cb && cb({ status: false, result: "Internal Server Error" });
            } else {               
                fs.readFile(payload.filename, function (err, data) {
                    if (err) {
                        cb && cb({ status: false, result: err }, statusCodes.INTERNAL_SERVER_ERROR);
                    }
                    else {
                         // Server is ready to take our messages.
                        var mailOptions = {
                            from: payload.from,             // sender address.
                            to: payload.to,                 // list of receivers.
                            subject: payload.subject,       // Subject line.
                            text: payload.message,          // plain text body.
                            html: payload.template,         // html body.
                            attachments: [{ 'filename': payload.filename, 'content': data }]
                        };
                        // send mail with defined transport object  and attachement.
                        transporter.sendMail(mailOptions, function (err, info) {
                            if (err) {
                                console.error('error in sendMail :', err);
                                cb && cb({ status: false, result: "Internal Server Error" }, statusCodes.INTERNAL_SERVER_ERROR);
                            }
                            else {
                                console.log('Mail Sent Successfully');
                                cb && cb({ status: true, result: "Mail Sent Successfully" }, statusCodes.OK);
                            }
                        });
                    }
                });
            };
        });
    }
}

var emailController = new EmailController();
export default emailController