Template.postPage.helpers({
    images: function() {
        return Images.find({
            '_id': {$in: this.filesIdArray}
        })
    },

    audio: function() {
        return Audios.findOne({_id: this.content})
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
    likedClass: function() {
        var userId = Meteor.userId();
        if (userId && !_.include(this.likers, userId)) {
            return 'btn-primary likeable';
        } else {
            return 'disabled';
        }
    }
});

Template.postPage.events({
    'click .likeable': function(e) {
        e.preventDefault();
        Meteor.call('like', this._id);
    }
});

Template.postPage.rendered = function() {
    $('#tags').tagsinput();
};


