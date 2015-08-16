Template.audioPostEdit.onCreated(function() {
    Session.set('audioPostEditErrors', {});
    var instance = this;
    instance.content = new ReactiveVar("");
    instance.content.set(this.data.content);
    instance.thumbnail = new ReactiveVar("");
    instance.thumbnail.set(this.data.thumbnail);
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

    thumbnail: function() {
        if (Template.instance().thumbnail.get() != ""){
            return Thumbnails.findOne({_id: Template.instance().thumbnail.get()})
        }
    },

    isFileUploading: function() {
        return Session.get('isFileUploading');
    },

    disableUploadButton: function(){
        if (Template.instance().content.get()!="") {
            return "disabled";
        }
    },

    disableWhileUploading: function(){
        if (Session.get('isFileUploading')==true) {
            return "disabled";
        }
    },

    disableUploadThumbnailButton: function(){
        if (Template.instance().thumbnail.get()!="") {
            return "disabled";
        }
    },

    disableEmbedField: function(){
        if (Template.instance().content.get() != ""){
            if (Audios.findOne({_id: Template.instance().content.get()})!=undefined){
                return "disabled";
            }
        }
    }
});

Template.audioPostEdit.events({
    'submit form': function(e, instance) {
        e.preventDefault();

        var currentPostId = this._id

        var embed;

        if (Audios.findOne({_id: Template.instance().content.get()})!=undefined){
            embed = false;
        }else{
            embed = true;
        }

        var postProperties = {
            title: $(e.target).find('[name=title]').val(),
            description: $(e.target).find('[name=description]').val(),
            embed: embed,
            thumbnail: instance.thumbnail.get(),
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

            Thumbnails.remove({ _id: instance.thumbnail.get()}, function(error) {
                if (error) {
                    toastr.error("Delete failed... " + error);
                }
            });

            instance.content.set("");
            instance.thumbnail.set("");
            Posts.remove(currentPostId);
            toastr.success("Post deleted!");
            Router.go('home');
        }
    },

    "change .add_audio": function(e, instance){
        var user = Meteor.user();

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

    "change .add_thumbnail": function(e, instance){
        var user = Meteor.user();

        FS.Utility.eachFile(e, function(file) {
            var newFile = new FS.File(file);
            newFile.username = user.username;
            newFile.userId = user._id;
            newFile.userSlug = Slug.slugify(user.username);

            Thumbnails.insert(newFile, function (error, result) {
                if (error) {
                    toastr.error("File upload failed... please try again.");
                } else {

                    Session.set('isFileUploading', true);

                    var intervalHandle = Meteor.setInterval(function () {

                        if (result.hasStored('bigThumbs') && result.hasStored('smallThumbs')) {
                            // File has been uploaded and stored. Can safely display it on the page.
                            toastr.success('Thumbnail upload succeeded!');
                            instance.thumbnail.set(result._id);
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
    },

    'click .delete-thumbnail': function(e, instance) {
        e.preventDefault();

        var sure = confirm('Are you sure you want to delete this thumbnail?');
        if (sure === true) {
            var thumbnailId = this._id;
            Thumbnails.remove({ _id: thumbnailId }, function(error) {
                if (error) {
                    toastr.error("Delete failed... " + error);
                } else {
                    instance.thumbnail.set("");
                    toastr.success('Thumbnail deleted!');
                }
            })
        }
    },

    'change #embed': function(e, instance){
        var value = $(e.target).val();
        instance.content.set(value);
    }
});

Template.audioPostEdit.rendered = function(){
    $('#tags').tagsinput();
    $('#category').val(this.data.category);
};
