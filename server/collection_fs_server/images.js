var imageStore = new FS.Store.S3("images", {
    /* REQUIRED */
    accessKeyId: key,
    secretAccessKey: key,
    bucket: "artmatches"
});

Images = new FS.Collection("Images", {
    stores: [imageStore],
    filter: {
        allow: {
            contentTypes: ['image/*']
            //TODO check if you have further define any filters for the image extensions
        }
    }
});


Images.allow({
    insert: function(userId) { return userId != null; },
    remove: function(userId, image) { return userId === image.userId; },
    update: function(userId, image) { return userId === image.userId; },
    download: function() { return true; }
});
