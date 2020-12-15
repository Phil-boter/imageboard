const aws = require('aws-sdk');
const fs = require('fs');

let secrets;
if (process.env.NODE_ENV == 'production') {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require('./secrets'); // in dev they are in secrets.json which is listed in .gitignore
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET
});

module.exports.upload = (req, res, next) => {


const {filename, mimetype, size, path} = req.file;

    const promise = s3
    .putObject({
        Bucket: 'spicedling', // change this to your own bucket name
        ACL: 'public-read', // basiclly saying peolpe caon view this file
        Key: filename, // 
        Body: fs.createReadStream(path),
        ContentType: mimetype,
        ContentLength: size
    }).promise();

    promise
    .then(
        () => {
            // it worked!!!
            console.log("amzon image upload complete");
            next();
            // optional 
            fs.unlink(path, ()=>{
                //this is noop function "no operation"
            })
        }
    ).catch(
        err => {
            // uh oh
            console.log("something went wrong uploading to s3",err);
            res.sendStatus(404);    
        }
    );
};