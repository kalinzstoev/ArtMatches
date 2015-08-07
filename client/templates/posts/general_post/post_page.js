Template.postPage.helpers({
    images: function() {
        return Images.find({
            '_id': {$in: this.filesIdArray}
        })
    },

    audios: function() {
        return Audios.find({
            '_id': {$in: this.filesIdArray}
        })
    },

    tags: function(){
        var tags = this.tags;
        tags.forEach(function(part, index) {
            tags[index] = " #" + tags[index];
        });

        return tags;
    },

    ownPost: function() {
        return this.userId == Meteor.userId();
    },

    comments: function() {
        return Comments.find({postId: this._id});
    },

    //TODO handle a dislike/liked functionality
    upvotedClass: function() {
        var userId = Meteor.userId();
        if (userId && !_.include(this.upvoters, userId)) {
            return 'btn-primary upvotable';
        } else {
            return 'disabled';
        }
    }
});

Template.postPage.events({
    'click .upvotable': function(e) {
        e.preventDefault();
        Meteor.call('upvote', this._id);
    }
});

Template.postPage.rendered = function() {
    $('#tags').tagsinput();
};


