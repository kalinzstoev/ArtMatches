//Template reactive array variable
var filesIdArray = new ReactiveArray();

Template.visualPostSubmit.onCreated(function() {
    Session.set('visualPostSubmitErrors', {});
});

Template.visualPostSubmit.helpers({
    errorMessage: function(field) {
        return Session.get('visualPostSubmitErrors')[field];
    },
    errorClass: function (field) {
        return !!Session.get('visualPostSubmitErrors')[field] ? 'has-error' : '';
    },
    images: function() {
        if (filesIdArray.list().length > 0){
            return Images.find({
                '_id': {$in: filesIdArray.array()}
            })
        }
    },

    isFileUploading: function() {
        return Session.get('isFileUploading');
    }
});

Template.visualPostSubmit.events({
    'submit form': function(e) {
        e.preventDefault();

        var post = {
            postType: 'visual',
            title: $(e.target).find('[name=title]').val(),
            description: $(e.target).find('[name=description]').val(),
            category: $(e.target).find('[name=category]').val(),
            tags: $("#tags").tagsinput('items'),
            filesIdArray: filesIdArray.slice(),
            isFilePresent: filesIdArray.length > 0
        };

        var errors = validateFilePost(post);
        if (errors.title || errors.category || errors.filesIdArray)
            return Session.set('visualPostSubmitErrors', errors);

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

    "change .add_image": function(e){
        var user = Meteor.user();
        //TODO currently you can't upload the same file name twice
        //TODO think about disabling the submit button and the audio button while uploading

        FS.Utility.eachFile(e, function(file)
        {
            var newFile = new FS.File(file);
            newFile.username = user.username;
            newFile.userId = user._id;
            newFile.userSlug = Slug.slugify(user.username);

            Images.insert(newFile, function (error, result) {
                if (error) {
                    toastr.error("File upload failed... please try again.");
                } else {

                    Session.set('isFileUploading', true);

                    var intervalHandle = Meteor.setInterval(function () {

                        if (result.hasStored('images')) {
                            // File has been uploaded and stored. Can safely display it on the page.
                            Session.set('isFileUploading', false);
                            filesIdArray.push(result._id);
                            toastr.success('File upload succeeded!');
                            // File has stored, close out interval
                            Meteor.clearInterval(intervalHandle);
                        }
                    }, 1000);
                }
            });
        });
    },

    'click .delete-image': function(e) {
        e.preventDefault();

        var sure = confirm('Are you sure you want to delete this image?');
        if (sure === true) {
            var imageId = this._id;
            Images.remove({ _id:imageId }, function(error,result) {
                if (error) {
                    toastr.error("Delete failed... " + error);
                } else {
                    filesIdArray.remove(imageId);
                    toastr.success('Image deleted!');
                }
            })
        }
    }
});

Template.visualPostSubmit.rendered = function(){
    $('#tags').tagsinput();
}




