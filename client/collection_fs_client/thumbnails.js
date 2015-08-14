var bigThumbStore = new FS.Store.S3("bigThumbs");
var smallThumbStore = new FS.Store.S3("smallThumbs");

Thumbnails = new FS.Collection("Thumbnails", {
    stores: [bigThumbStore, smallThumbStore],
    filter: {
        allow: {
            contentTypes: ['image/*']
        },
        onInvalid: function(message) {
            toastr.error(message);
        }
    }
});