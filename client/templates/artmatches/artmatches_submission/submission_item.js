Template.submissionItem.helpers({
    voteClass: function() {
        var userId = Meteor.userId();
        if (userId && !_.include(this.voters, userId)) {
            return 'btn-primary upvoteable';
        } else {
            return 'disabled';
        }
    }
})

Template.submissionItem.events({
    'click .see-content': function (event) {
        event.preventDefault();
        Session.set("submissionContentId", this._id);
    },

    'click .upvoteable': function (event) {
        event.preventDefault();
        Meteor.call('vote', this._id);
        //var currentArtmatch = Artmatches.findOne({originalPostId: this.submittedToPostId})
    }
})