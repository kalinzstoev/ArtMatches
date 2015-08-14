Template.writtenPostSubmit.onCreated(function() {
    Session.set('writtenPostSubmitErrors', {});
    var instance = this;
    instance.thumbnail = new ReactiveVar("");
});

Template.writtenPostSubmit.helpers({
    errorMessage: function(field) {
        return Session.get('writtenPostSubmitErrors')[field];
    },
    errorClass: function (field) {
        return !!Session.get('writtenPostSubmitErrors')[field] ? 'has-error' : '';
    },

    thumbnail: function() {
        if (Template.instance().thumbnail.get() != ""){
            return Thumbnails.findOne({_id: Template.instance().thumbnail.get()})
        }
    },

    isFileUploading: function() {
        return Session.get('isFileUploading');
    },

    disableUploadThumbnailButton: function(){
        if (Template.instance().thumbnail.get()!="") {
            return "disabled";
        }
    },

    disableWhileUploading: function(){
        if (Session.get('isFileUploading')==true) {
            return "disabled";
        }
    },
});

Template.writtenPostSubmit.events({
    'submit form': function(e, instance) {
        e.preventDefault();

        var post = {
            postType: 'written',
            title: $(e.target).find('[name=title]').val(),
            description: $(e.target).find('[name=description]').val(),
            thumbnail: instance.thumbnail.get(),
            category: $(e.target).find('[name=category]').val(),
            tags: $("#tags").tagsinput('items'),
            type: $(e.target).find('[name=type]').val(),
            text: $('#summernote').code()
        };

        var errors = validateTextPost(post);
        if (errors.title || errors.category ||errors.type ||errors.text)
            return Session.set('writtenPostSubmitErrors', errors);

        Meteor.call('postTextInsert', post, function(error, result) {
            // display the error to the user and abort
            console.log(error);
            if (error)
                return throwError(error.reason);

            Router.go('postPage', {_id: result._id});
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

Template.writtenPostSubmit.rendered = function(){
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

    $('#tags').tagsinput();
};



