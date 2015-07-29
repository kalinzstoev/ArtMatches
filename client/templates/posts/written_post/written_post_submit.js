Template.writtenPostSubmit.onCreated(function() {
    Session.set('writtenPostSubmitErrors', {});
});

Template.writtenPostSubmit.helpers({
    errorMessage: function(field) {
        return Session.get('writtenPostSubmitErrors')[field];
    },
    errorClass: function (field) {
        return !!Session.get('writtenPostSubmitErrors')[field] ? 'has-error' : '';
    }
});

Template.writtenPostSubmit.events({
    'submit form': function(e) {
        e.preventDefault();

        var post = {
            postType: 'written',
            title: $(e.target).find('[name=title]').val(),
            description: $(e.target).find('[name=description]').val(),
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
    }



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
            ['table', ['table']],
            ['insert', ['link', 'hr']],
            ['view', ['fullscreen']],
            ['help', ['help']]
        ],
        height: 150
    });

    $('#tags').tagsinput();
};



