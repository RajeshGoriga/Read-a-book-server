import path from 'path';
require('dotenv').config();


const APP_NAME = process.env.APP_NAME || `READABOOK`;
const DB_NAME = process.env.DB_NAME || `readabook`;

export default {
    secret: `nightflury_secret`, // Secret Key
    server: { // Express
        ip: process.env.SERVER_IP || 'localhost',
        port: process.env.SERVER_PORT || 8000,
    },
    port: 8000,
    log: true,
    redisConfig: {
        host: process.env.REDIS_HOST, //can be IP or hostname,
        port: process.env.REDIS_PORT, // port
        maxretries: process.env.REDIS_MAXRETRIES, //reconnect retries, default 10
        secret: process.env.REDIS_SECRET_KEY, // secret key for Tokens!
        multiple: true, // single or multiple sessions by user
        kea: false // Enable notify-keyspace-events KEA
    },
    dbConfig: {
        uri: process.env.MONGO_URL,
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            socketTimeoutMS: 0,
            keepAlive: true,
            reconnectTries: 30
        }
    },
    
    sesConfig: {
        "accesskeyid": process.env.SES_ACCESSKEYID,
        "securitykey": process.env.SES_SECURITYKEY,
        "serverName":   process.env.SES_SERVERNAME,
        "region"    :   process.env.SES_REGION,
        "port"      :   process.env.SES_PORT,  // 465 or 587
        "tls"       :   process.env.SES_TLS,
        "username"  :   process.env.SES_USERNAME,
        "password"  :   process.env.SES_PASSWORD
    },

    s3Config:{
        region: process.env.S3_REGION,
        accessKeyId: process.env.S3_ACCESSKEYID,
        secretAccessKey: process.env.S3_SECRETACCESSKEY,
        bucketName:process.env.S3_BUCKETNAME,
        profilepicFolder: process.env.S3_PROFILEPICFOLDER,
        reportFolder: process.env.S3_REPORTSFOLDER,
        expirationTime: process.env.S3_EXPIRY_TIME
    },

    smsConfig:{
        hostname:process.env.SMS_HOSTNAME,
        path:process.env.SMS_PATH,
        authkey:process.env.SMS_AUTHKEY,
        port:process.env.SMS_PORT,
        sender:process.env.SMS_SENDER,
        route: process.env.SMS_ROUTE,
    },

    swagger: {
        enabled: true, // router -> http://localhost:8000/docs/,
        info: {
            version: 'v1.0',
            title: APP_NAME,
            description: `RESTful API ${APP_NAME}`,
            contact: {
                name: "",
                url: "",
                email: "gorigarajesh@gmail.com"
            }
        }
    },

    authConfig: {
        local: true,
        facebook: false,
        google: false
    },

    aes: {
        key: process.env.AES_KEY,
        iv: process.env.AES_IV
    },

    mode: process.env.NODE_ENV || 'development', // mode
    name: APP_NAME, // name 
    node: parseInt(process.env.NODE_APP_INSTANCE) || 0, // node instance
    root: path.normalize(`${__dirname}/../..`), // root
    base: path.normalize(`${__dirname}/..`), // base
}