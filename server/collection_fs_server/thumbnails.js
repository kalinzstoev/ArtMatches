var bigThumbStore = new FS.Store.S3("bigThumbs", {
    /* REQUIRED */
    accessKeyId: "AKIAILLXBNDCK75Q47DQ",
    secretAccessKey: "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",
    bucket: "artmatches",
    region: "eu-west-1",

    transformWrite: function(fileObj, readStream, writeStream) {
        var size = '200';
        gm(readStream).autoOrient().resize(size, size + '^').gravity('Center').extent(size, size).stream('PNG').pipe(writeStream);
    }
});


var smallThumbStore = new FS.Store.S3("smallThumbs", {
    /* REQUIRED */
    accessKeyId: "AKIAILLXBNDCK75Q47DQ",
    secretAccessKey: "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",
    bucket: "artmatches.thumbs",
    region:"eu-west-1",

    transformWrite: function(fileObj, readStream, writeStream) {
        var size = '30';
        gm(readStream).autoOrient().resize(size, size + '^').gravity('Center').extent(size, size).stream('PNG').pipe(writeStream);
    }
});


Thumbnails = new FS.Collection("Thumbnails", {
    stores: [bigThumbStore, smallThumbStore],
    filter: {
        allow: {
            contentTypes: ['image/*']
        }
    }
});


Thumbnails.allow({
    insert: function(userId) { return userId != null; },
    remove: function(userId, image) { return userId === image.userId; },
    update: function(userId, image) { return userId === image.userId; },
    download: function() { return true; }
});
