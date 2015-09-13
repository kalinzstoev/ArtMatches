var imageStore = new FS.Store.S3("images", {
    /* REQUIRED */
    accessKeyId: "",
    secretAccessKey: "",
    bucket: "artmatches",
    region: "eu-west-1"
});


var thumbsStore = new FS.Store.S3("thumbs", {
    /* REQUIRED */
    accessKeyId: "AKIAILLXBNDCK75Q47DQ",
    secretAccessKey: "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",
    bucket: "artmatches.thumbs",
    region:"eu-west-1",

    transformWrite: function(fileObj, readStream, writeStream) {
        var size = '200';
        gm(readStream).autoOrient().resize(size, size + '^').gravity('Center').extent(size, size).stream('PNG').pipe(writeStream);
    }
});


Images = new FS.Collection("Images", {
    stores: [imageStore, thumbsStore],
    filter: {
        allow: {
            contentTypes: ['image/*']
        }
    }
});


Images.allow({
    insert: function(userId) { return userId != null; },
    remove: function(userId, image) { return userId === image.userId; },
    update: function(userId, image) { return userId === image.userId; },
    download: function() { return true; }
});
