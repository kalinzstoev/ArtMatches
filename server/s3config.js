S3.config = {
        key: 'AKIAJLSH45QCWPW4JFQQ',
        secret: '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',
        bucket: 'test',
        region: 'eu-west-1'
    };


Meteor.methods({
    chooseS3Bucket: function(inputBucket) {
        S3.config.bucket = inputBucket;
        S3.knox = Knox.createClient(S3.config);
    }
        });

