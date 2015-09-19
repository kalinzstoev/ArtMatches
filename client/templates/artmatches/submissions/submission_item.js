Template.submissionItem.helpers({

    //Makes sure the vote button is disabled if the user has voted or can't vote and displays an upvotable class if he can
    voteClass: function() {
        var userId = Meteor.userId();
        if (userId && !_.include(this.voters, userId)) {
            return 'btn-success upvoteable';
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

    //A function which calls the vote server method when the like button has been clicked
    'click .upvoteable': function (event) {
        event.preventDefault();
        Meteor.call('vote', this._id);
    }
})