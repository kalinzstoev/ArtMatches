//Declares the client side collection which is going to store the images for the visual posts

var imageStore = new FS.Store.S3("images");
var thumbStore = new FS.Store.S3("thumbs");

Images = new FS.Collection("Images", {
    stores: [imageStore, thumbStore],
    filter: {
        allow: {
            //Defines what files could be inserted into the collection
            contentTypes: ['image/*']
        },
        onInvalid: function(message) {
            toastr.error(message);
        }
    }
});