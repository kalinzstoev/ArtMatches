var imageStore = new FS.Store.S3("images");
Images = new FS.Collection("Images", {
    stores: [imageStore],
    filter: {
        allow: {
            contentTypes: ['image/*']
        },
        onInvalid: function(message) {
            toastr.error(message);
        }
    }
});