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
    },


    artMatchId: function() {
        return Session.get('artmatchId');
       },
    hasArtMatch: function() {
        var artmatch = Artmatches.findOne({originalPostId: this._id});

        if (artmatch!=undefined){
            Session.set('artmatchId', artmatch._id)
            return true;
        } else {
            return false;
        }
    }
});

Template.postPage.events({
    'click .likeable': function(e) {
        e.preventDefault();
        Meteor.call('postLike', this._id);
    }
});

Template.postPage.rendered = function() {
    $('#tags').tagsinput();
};


