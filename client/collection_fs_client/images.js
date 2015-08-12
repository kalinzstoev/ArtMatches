var imageStore = new FS.Store.S3("images");
var thumbStore = new FS.Store.S3("thumbs");

Images = new FS.Collection("Images", {
    stores: [imageStore, thumbStore],
    filter: {
        allow: {
            contentTypes: ['image/*']
        },
        onInvalid: function(message) {
            toastr.error(message);
        }
    }
});