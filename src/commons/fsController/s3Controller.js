import AWS from 'aws-sdk'
import awsConfig from 'aws-config';
import config from '../../config/index';


class S3Controller {
    constructor() {



        this.client = new AWS.S3(awsConfig({
            region: process.env.S3_REGION || config.s3Config.region,
            accessKeyId: process.env.S3_ACCESSKEYID || config.s3Config.accessKeyId,
            secretAccessKey: process.env.S3_SECRETACCESSKEY || config.s3Config.secretAccessKey,
            timeout: 15000
        }));
        this.s3Bucket=config.s3Config.bucketName;
        this.bucketFolder= config.s3Config.bucketFolder;
        this.expirationTime = config.s3Config.expirationTime;
        
    }

    uploadFile(file, callback) {
        // let fileData = fs.createReadStream(file.path);
        let filename = file.name.replace(/ /g, '')
        var params = {
            Bucket: this.s3Bucket,
            Key: this.bucketFolder + filename,
            ACL: 'public-read',
            ContentType: file.mimetype,
            Body: file.data
        }
        let self = this
        this.client.putObject(params, function (err, response) {
            if (err) {
                callback(err, response);
            }
            else {
                let url = self.client.endpoint.href + this.s3Bucket + "/" + this.bucketFolder + filename;
                callback(err, url);
            }
        });
    }

    getTimestamp(){
        return Math.round(new Date().getTime() / 1000);
    }

    uploadFileData(fileData, fileName, type, bucketFolder, callback) {
        let name = this.getTimestamp()+ fileName
        var params = {
            Bucket: this.s3Bucket,
            Key: bucketFolder + "/" +  name,
            ContentType: type,
            Body: fileData
        }
        
        let self = this
        this.client.putObject(params, function (err, response) {
            console.log('file response',response)
            if (err) {
                callback(err, response);
            }
            else {
                let url = self.client.endpoint.href + self.s3Bucket + "/" + bucketFolder + "/" +  name;
                callback(err, url);
            }
        });
    }



    uploadPrivateFileData(fileData, fileName, type, bucketFolder, callback) {
        let name = this.getTimestamp() + fileName
        var params = {
            Bucket: this.s3Bucket,
            Key: bucketFolder + "/" + name,
            ContentType: type,
            Body: fileData
        }

        let self = this
        this.client.putObject(params, function (err, response) {
            console.log('file response', response)
            if (err) {
                callback(err, response);
            }
            else {
                let url = self.client.endpoint.href + self.s3Bucket + "/" + bucketFolder + "/" + name;
                callback(err, url);
            }
        });
    }

    getS3SignedUrl(fileKey) {
        let params = { Key: fileKey, Bucket: this.s3Bucket, Expires: this.expirationTime }
        console.log('params', params)
        return this.client.getSignedUrl('getObject', params);
    }

    getS3PublicUrl(fileKey) {
        return this.client.getPublicUrlHttp(this.s3Bucket, fileKey);
    }
}

const s3Controller = new S3Controller();
export default s3Controller;