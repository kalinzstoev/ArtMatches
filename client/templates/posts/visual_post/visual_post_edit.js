Template.visualPostEdit.onCreated(function() {
    Session.set('visualPostEditErrors', {});
    //Add ids of the post instance to the filesIdArray of the template instance
    var instance = this;
    instance.filesIdArray = new ReactiveArray();
    this.data.filesIdArray.forEach(function(element) {
        instance.filesIdArray.push(element);
    });
});

Template.visualPostEdit.helpers({
    errorMessage: function(field) {
        return Session.get('visualPostEditErrors')[field];
    },
    errorClass: function (field) {
        return !!Session.get('visualPostEditErrors')[field] ? 'has-error' : '';
    },

    tags: function(){
        var tags = this.tags;
        return tags;;
    },

    images: function() {
        if (Template.instance().filesIdArray.list().length > 0){
            return Images.find({
                '_id': {$in: Template.instance().filesIdArray.array()}
            })
        }
    },
    isFileUploading: function() {
        return Session.get('isFileUploading');
    },

    disableUploadButton: function(){
        if (Session.get('isFileUploading')==true){
            return "disabled";
        }
    }
});

Template.visualPostEdit.events({
    'submit form': function(e, instance) {
        e.preventDefault();

        var currentPostId = this._id

        var postProperties = {
            title: $(e.target).find('[name=title]').val(),
            description: $(e.target).find('[name=description]').val(),
            category: $(e.target).find('[name=category]').val(),
            tags: $("#tags").tagsinput('items'),
            filesIdArray: instance.filesIdArray.slice(),
            isContentPresent: instance.filesIdArray.length > 0
        }

        var errors = validateFilePost(postProperties);
        if (errors.title || errors.category ||errors.isContentPresent)
            return Session.set('visualPostEditErrors', errors);

        Posts.update(currentPostId, {$set: postProperties}, function(error) {
            if (error) {
                // display the error to the user
                throwError(error.reason);
            } else {
                instance.filesIdArray.clear();
                toastr.success("Post was updated successfully")
                Router.go('postPage', {_id: currentPostId});
            }
        });
    },

    'click .delete': function(e, instance) {
        e.preventDefault();

        if (confirm("Delete this post?")) {
            var currentPostId = this._id;

            instance.filesIdArray.forEach(function(element){
                Images.remove(element),function (error) {
                    if (error) {
                        toastr.error("Delete failed" + error);
                    }
                }
            });

            instance.filesIdArray.clear();
            Posts.remove(currentPostId);
            toastr.success("Post deleted!");
            Router.go('home');
        }
    },

    "change .add_image": function(e, instance){
        var user = Meteor.user();
        //TODO currently you can't upload the same file name twice
        //TODO think about disabling the submit button and the audio button while uploading

        FS.Utility.eachFile(e, function(file) {
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
                            instance.filesIdArray.push(result._id);
                            toastr.success('File upload succeeded!');
                            // File has stored, close out interval
                            Meteor.clearInterval(intervalHandle);
                        }
                    }, 1000);
                }
            });
        });
    },

    'click .delete-image': function(e, instance) {
        e.preventDefault();

        var sure = confirm('Are you sure you want to delete this image?');
        if (sure === true) {
            var imageId = this._id;
            Images.remove({ _id:imageId }, function(error,result) {
                if (error) {
                    toastr.error("Delete failed... " + error);
                } else {
                    instance.filesIdArray.remove(imageId);
                    toastr.success('Image deleted!');
                }
            })
        }
    }


});

Template.visualPostEdit.rendered = function(){
    $('#tags').tagsinput();
    $('#category').val(this.data.category);
};


