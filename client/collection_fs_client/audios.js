var audioStore = new FS.Store.S3("audios");
Audios = new FS.Collection("Audios", {
    stores: [audioStore],
    filter: {
        allow: {
            contentTypes: ['audio/*']
        },
        onInvalid: function(message) {
            toastr.error(message);
        }
    }
});