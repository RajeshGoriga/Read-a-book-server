import http from 'http';
import config from '../../config/index';

export default class SmsController {
    constructor() {
        this.options = {
            hostname: config.smsConfig.hostname,
            path: config.smsConfig.path,
            authkey: config.smsConfig.authkey,
            port: config.smsConfig.port,
            sender: config.smsConfig.sender,
            route: config.smsConfig.route
        }
    }

    setOptions() {
        var options = {
            "method": "POST",
            "hostname": this.options.hostname,
            "path": this.options.path,
            "headers": {
                "authkey": this.options.authkey,
                "content-type": "application/json"
            }
        }
        return options;
    }

    /**
     * sendSMS method will send sms
     * @param sms: Array of sms with array of to numbers [{message:"", to:['98260XXXXX']}]
     * @param countryCode: country code eg: 91 for india
     * @author  Rajesh Goriga
     * @version 2.0
     */
    sendSMS(sms, countryCode) {
        console.log("sms:", sms);
        var options = this.setOptions();
        var req = http.request(options, function (res) {
            var chunks = [];
            res.on("data", function (chunk) {
                chunks.push(chunk);
            });
            res.on("end", function () {
                console.log('end');
                var body = Buffer.concat(chunks);
                console.log(body.toString());
            });
        });
        req.write(JSON.stringify({
            sender: this.options.sender,
            route: this.options.route,
            country: countryCode,
            sms:sms
        }));
        req.end();
    }
}