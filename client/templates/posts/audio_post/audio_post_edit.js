//Template reactive array variable


Template.audioPostEdit.onCreated(function() {
    Session.set('audioPostEditErrors', {});
    var instance = this;
    instance.content = new ReactiveVar("");
    //Add ids of the post instance to the filesIdArray of the template instance
    instance.content.set(this.data.content);
});

Template.audioPostEdit.helpers({
    errorMessage: function(field) {
        return Session.get('audioPostEditErrors')[field];
    },
    errorClass: function (field) {
        return !!Session.get('audioPostEditErrors')[field] ? 'has-error' : '';
    },

    tags: function(){
        var tags = this.tags;
        return tags;
    },
    audio: function() {
        if (Template.instance().content.get() != ""){
            return Audios.findOne({_id: Template.instance().content.get()})
        }
    },
    isFileUploading: function() {
        return Session.get('isFileUploading');
    },

    disableUploadButton: function(){
        if (Session.get('isFileUploading')==true || Template.instance().content.get()!=""){
            return "disabled";
        }
    }
});

Template.audioPostEdit.events({
    'submit form': function(e, instance) {
        e.preventDefault();

        var currentPostId = this._id

        var postProperties = {
            title: $(e.target).find('[name=title]').val(),
            description: $(e.target).find('[name=description]').val(),
            category: $(e.target).find('[name=category]').val(),
            tags: $("#tags").tagsinput('items'),
            content: instance.content.get(),
            isContentPresent: instance.content.get() != ""
        }

        var errors = validateFilePost(postProperties);
        if (errors.title || errors.category|| errors.isContentPresent)
            return Session.set('audioPostEditErrors', errors);

        Posts.update(currentPostId, {$set: postProperties}, function(error) {
            if (error) {
                // display the error to the user
                throwError(error.reason);
            } else {
                instance.content.set("");
                toastr.success("Post was updated successfully")
                Router.go('postPage', {_id: currentPostId});
            }
        });
    },

    'click .delete': function(e, instance) {
        e.preventDefault();

        if (confirm("Delete this post?")) {
            var currentPostId = this._id;

            Audios.remove({ _id: instance.content.get()}, function(error) {
                if (error) {
                    toastr.error("Delete failed... " + error);
                }
            });

            instance.content.set("");
            Posts.remove(currentPostId);
            toastr.success("Post deleted!");
            Router.go('home');
        }
    },

    "change .add_audio": function(e, instance){
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
                            instance.content.set(result._id);
                            Session.set('isFileUploading', false);
                            // File has stored, close out interval
                            Meteor.clearInterval(intervalHandle);
                        }
                    }, 1000);
                }
            });
        });
    },

    'click .delete-audio': function(e, instance) {
        e.preventDefault();

        var sure = confirm('Are you sure you want to delete this audio?');
        if (sure === true) {
            var audioId = this._id;
            Audios.remove({ _id:audioId }, function(error) {
                if (error) {
                    toastr.error("Delete failed... " + error);
                } else {
                    instance.content.set("");
                    toastr.success('Audio deleted!');
                }
            })
        }
    }
});

Template.audioPostEdit.rendered = function(){
    $('#tags').tagsinput();
    $('#category').val(this.data.category);
};
