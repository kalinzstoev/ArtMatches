Template.writtenPostEdit.onCreated(function() {
    Session.set('writtenPostEditErrors', {});
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
    }
});

Template.writtenPostEdit.events({
    'submit form': function(e) {
        e.preventDefault();

        var currentPostId = this._id

        var postProperties = {
            title: $(e.target).find('[name=title]').val(),
            description: $(e.target).find('[name=description]').val(),
            category: $(e.target).find('[name=category]').val(),
            tags: $("#tags").tagsinput('items'),
            type: $(e.target).find('[name=type]').val(),
            text: $('#summernote').code()
        }

        var errors = validateTextPost(postProperties);
        if (errors.title || errors.category ||errors.type ||errors.text)
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

    'click .delete': function(e) {
        e.preventDefault();

        if (confirm("Delete this post?")) {
            var currentPostId = this._id;
            Posts.remove(currentPostId);
            toastr.success("Post deleted!");
            Router.go('home');
        }
    }

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
            ['table', ['table']],
            ['insert', ['link', 'hr']],
            ['view', ['fullscreen']],
            ['help', ['help']]
        ],
        height: 150
    });

    $('#summernote').code(this.data.text);
    $('#tags').tagsinput();
    $('#type').val(this.data.type);
    $('#category').val(this.data.category);
};


