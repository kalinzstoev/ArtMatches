//Declares the client side collection which is going to store the images for the visual posts

var bigThumbStore = new FS.Store.S3("bigThumbs");
var smallThumbStore = new FS.Store.S3("smallThumbs");

Thumbnails = new FS.Collection("Thumbnails", {
    stores: [bigThumbStore, smallThumbStore],
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