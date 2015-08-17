Template.writtenPostEdit.onCreated(function() {
    Session.set('writtenPostEditErrors', {});
    var instance = this;
    instance.thumbnail = new ReactiveVar("");
    instance.thumbnail.set(this.data.thumbnail);
});

Template.writtenPostEdit.helpers({
    errorMessage: function(field) {
        return Session.get('writtenPostEditErrors')[field];
    },
    errorClass: function (field) {
        return !!Session.get('writtenPostEditErrors')[field] ? 'has-error' : '';
    },

    tags: function(){
        var tags = this.tags;
        return tags;;
    },

    thumbnail: function() {
        if (Template.instance().thumbnail.get() != ""){
            return Thumbnails.findOne({_id: Template.instance().thumbnail.get()})
        }
    },

    isFileUploading: function() {
        return Session.get('isFileUploading');
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
});

//TODO Consider switching the whole update to the server as right now the edited text doesn't get purified
Template.writtenPostEdit.events({
    'submit form': function(e,instance) {
        e.preventDefault();

        var currentPostId = this._id

        var postProperties = {
            title: $(e.target).find('[name=title]').val(),
            description: $(e.target).find('[name=description]').val(),
            thumbnail: instance.thumbnail.get(),
            category: $(e.target).find('[name=category]').val(),
            tags: $("#tags").tagsinput('items'),
            //type: $(e.target).find('[name=type]').val(),
            text: $('#summernote').code()
        }

        var errors = validateTextPost(postProperties);
        //||errors.type
        if (errors.title || errors.category  ||errors.text)
            return Session.set('writtenPostEditErrors', errors);

        Posts.update(currentPostId, {$set: postProperties}, function(error) {
            if (error) {
                // display the error to the user
                throwError(error.reason);
            } else {
                toastr.success("Post was updated successfully")
                Router.go('postPage', {_id: currentPostId});
            }
        });
    },

    'click .delete': function(e, instance) {
        e.preventDefault();

        if (confirm("Delete this post?")) {

            Thumbnails.remove({ _id: instance.thumbnail.get()}, function(error) {
                if (error) {
                    toastr.error("Delete failed... " + error);
                }
            });

            instance.thumbnail.set("");

            var currentPostId = this._id;
            Posts.remove(currentPostId);
            toastr.success("Post deleted!");
            Router.go('home');
        }
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

});

Template.writtenPostEdit.rendered = function(){
    $('#summernote').summernote({
        toolbar: [
            ['style', ['style']],
            ['font', ['bold', 'italic', 'underline', 'clear']],
            ['fontname', ['fontname']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['height', ['height']],
            ['insert', ['hr']],
            ['view', ['fullscreen']],
            ['help', ['help']]
        ],
        height: 150
    });

    $('#summernote').code(this.data.text);
    $('#tags').tagsinput();
    //$('#type').val(this.data.type);
    $('#category').val(this.data.category);
};


