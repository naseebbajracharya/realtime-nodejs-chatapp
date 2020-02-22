const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

AWS.config.update({
    accessKeyId: 'ACCESS_KEY',
    secretAccessKey: 'SECRET_ACCESS_KEY',
    region: 'REGION'
});

const S0 = new AWS.S3({});
const upload = multer({
    storage: multerS3({
        s3: S0,
        bucket: 'BUCKET-NAME',
        acl: 'public-read',
        metadata(req, file, cb){
            cb(null, {fieldName: file.fieldname});
        },
        key(req, file, cb){
            cb(null, file.originalname);
        },
        rename(fieldname, fileName){
            return fileName.replace(/\W+/g, '-');
        }
    })
});

exports.Upload = upload;