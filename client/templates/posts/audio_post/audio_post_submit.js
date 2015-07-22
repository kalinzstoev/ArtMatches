//Template non-reactive array variable
var filesIdArray = new ReactiveArray();;

Template.audioPostSubmit.onCreated(function() {
    Session.set('audioPostSubmitErrors', {});
    Session.set('isFileUploaded',false);
});

Template.audioPostSubmit.helpers({
    errorMessage: function(field) {
        return Session.get('audioPostSubmitErrors')[field];
    },
    errorClass: function (field) {
        return !!Session.get('audioPostSubmitErrors')[field] ? 'has-error' : '';
    }
});

Template.audioPostSubmit.events({
    'submit form': function(e) {
        e.preventDefault();

        var post = {
            title: $(e.target).find('[name=title]').val(),
            description: $(e.target).find('[name=description]').val(),
            category: $(e.target).find('[name=category]').val(),
            tags: $("#tags").tagsinput('items'),
            filesIdArray: filesIdArray.slice(),
            isFileUploaded: Session.get('isFileUploaded')
        };

        var errors = validateFilePost(post);
        if (errors.title || errors.category || errors.filesIdArray)
            return Session.set('audioPostSubmitErrors', errors);

        Meteor.call('postFileInsert', post, function(error, result) {
            // display the error to the user and abort
            if (error)
                return throwError(error.reason);

            Router.go('postPage', {_id: result._id});
        });
    }
});

Template.audioPostSubmit.events({
    "change .add_audio": function(e){
        var user = Meteor.user();

        FS.Utility.eachFile(e, function(file) {
            var newFile = new FS.File(file);
            newFile.username = user.username;
            newFile.userId = user._id;
            newFile.userSlug = Slug.slugify(user.username);
//TODO Change to new collection
            Audios.insert(newFile, function (error, result) {
                if (error) {
                    toastr.error("File upload failed... please try again.");
                } else {
                    toastr.success('File upload succeeded!');
                    filesIdArray.push(result._id);
                    Session.set('isFileUploaded', true);
                }
            });
        });
    }
});

Template.audioPostSubmit.rendered = function(){
    $('#tags').tagsinput();
}




