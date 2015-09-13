var audioStore = new FS.Store.S3("audios", {
    /* REQUIRED */
    accessKeyId: "",
    secretAccessKey: "",
    bucket: "artmatches"
});

Audios = new FS.Collection("Audios", {
    stores: [audioStore],
    filter: {
        allow: {
            contentTypes: ['audio/*']
            //TODO check if you have further define any filters for the audio extensions
        }
    }
});


Audios.allow({
    insert: function(userId) { return userId != null; },
    remove: function(userId, audio) { return userId === audio.userId; },
    update: function(userId, audio) { return userId === audio.userId; },
    download: function() { return true; }
});
