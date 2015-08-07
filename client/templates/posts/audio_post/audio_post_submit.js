//Template reactive array variable
var filesIdArray = new ReactiveArray();

Template.audioPostSubmit.onCreated(function() {
    Session.set('audioPostSubmitErrors', {});
});

Template.audioPostSubmit.helpers({
    errorMessage: function(field) {
        return Session.get('audioPostSubmitErrors')[field];
    },
    errorClass: function (field) {
        return !!Session.get('audioPostSubmitErrors')[field] ? 'has-error' : '';
    },
    audios: function() {
        if (filesIdArray.list().length > 0){
            return Audios.find({
                '_id': {$in: filesIdArray.array()}
            })
        }
    },
    isFileUploading: function() {
        return Session.get('isFileUploading');
    }
});

Template.audioPostSubmit.events({
    'submit form': function(e) {
        e.preventDefault();

        var post = {
            postType: 'audio',
            title: $(e.target).find('[name=title]').val(),
            //TODO check if a file or an embeded file was submitted
            soundcloud: $(e.target).find('[name=soundcloud]').val(),
            description: $(e.target).find('[name=description]').val(),
            category: $(e.target).find('[name=category]').val(),
            tags: $("#tags").tagsinput('items'),
            filesIdArray: filesIdArray.slice(),
            isFilePresent: filesIdArray.length > 0
        };

        var errors = validateFilePost(post);
        if (errors.title || errors.category || errors.filesIdArray)
            return Session.set('audioPostSubmitErrors', errors);

        Meteor.call('postFileInsert', post, function(error, result) {
            // display the error to the user and abort
            if (error) {
                return throwError(error.reason);
            }else {
                filesIdArray.clear();
                Router.go('postPage', {_id: result._id});
            }
        });
    },

    "change .add_audio": function(e){
        var user = Meteor.user();

        //TODO currently you can't upload the same file name twice
        //TODO think about disabling the submit button and the audio button while uploading
        FS.Utility.eachFile(e, function(file) {
            var newFile = new FS.File(file);
            newFile.username = user.username;
            newFile.userId = user._id;
            newFile.userSlug = Slug.slugify(user.username);

            Audios.insert(newFile, function (error, result) {
                if (error) {
                    toastr.error("File upload failed... please try again.");
                } else {

                    Session.set('isFileUploading', true);

                    var intervalHandle = Meteor.setInterval(function () {

                        if (result.hasStored('audios')) {
                        // File has been uploaded and stored. Can safely display it on the page.
                            toastr.success('File upload succeeded!');
                            filesIdArray.push(result._id);
                            Session.set('isFileUploading', false);
                            // File has stored, close out interval
                            Meteor.clearInterval(intervalHandle);
                        }
                    }, 1000);
                }
            });
        });
    },

    'click .delete-audio': function(e) {
        e.preventDefault();

        var sure = confirm('Are you sure you want to delete this audio?');
        if (sure === true) {
            var audioId = this._id;
            Audios.remove({ _id:audioId }, function(error,result) {
                if (error) {
                    toastr.error("Delete failed... " + error);
                } else {
                    filesIdArray.remove(audioId);
                    toastr.success('Audio deleted!');
                }
            })
        }
    }
});

Template.audioPostSubmit.rendered = function(){
    $('#tags').tagsinput();
}




