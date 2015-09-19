//Declares the client side collection for the audio files

var audioStore = new FS.Store.S3("audios");
Audios = new FS.Collection("Audios", {
    stores: [audioStore],
    filter: {
        allow: {
            //Defines what files could be inserted into the collection
            contentTypes: ['audio/*']
        },
        onInvalid: function(message) {
            toastr.error(message);
        }
    }
});