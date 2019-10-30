import AWS from 'aws-sdk';
import mailcomposer from 'mailcomposer';
import config from '../../config/index';

class SesController {
    constructor() {
        this.config = {
            serverName: config.sesConfig.serverName,
            region: config.sesConfig.region,
            accessKeyId: config.sesConfig.accesskeyid,
            secretAccessKey: config.sesConfig.securitykey
        }
    }

    configureAWS() {
        console.log(this.config)
        AWS.config.update(this.config);
    }

    sendEmail(payload, cb) {
        this.configureAWS();
        var params = {
            Destination: {
                ToAddresses: [payload.to]
            },
            Message: {
                Body: {
                    Html: {
                        Data: payload.template
                    }
                },
                Subject: {
                    Data: payload.subject
                },
            },
            Source: process.env.systemEmail
        };
        var ses = new AWS.SES({ apiVersion: '2010-12-01' });
        ses.sendEmail(params, function (err, data) {
            if (err) {
                console.log(err, err.stack);
                cb && cb({ status: false, result: err })
            }
            else {
                console.log(data);
                cb && cb({ status: true, result: data })
            }
        });
    }

    sendAttachments(payload, cb) {
        this.configureAWS();
        var ses = new AWS.SES({ apiVersion: '2010-12-01' });
        const mail = mailcomposer({
            from: payload.from,
            to: payload.to,
            subject: payload.subject,
            html: payload.template,
            attachments: [{
                filename: 'consent.pdf',
                content: payload.fileContent
                // path: payload.filename
            }],
        });

        mail.build((err, message) => {
            if (err) {
                reject(`Error sending raw email: ${err}`);
            }
            ses.sendRawEmail({ RawMessage: { Data: message } }, (err, response) => {
                if (err) {
                    cb && cb({ status: false, result: err })
                } else if (response) {
                    cb && cb({ status: true, result: response })
                }
            });
        });
    }
}

var sesController = new SesController();
export default sesController;