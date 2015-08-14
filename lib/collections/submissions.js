Submissions = new Mongo.Collection('submissions');

Submissions.allow({
    update: function(){ return true},
    remove: function(){ return true},
    insert: function(){ return true}
});

Meteor.methods({
    submissionInsert: function (submissionAttributes) {
        check(this.userId, String);

        check(submissionAttributes, {
            originalPostId: String,
            title: String,
            type: String,
            content: String,
        });


        var user = Meteor.user();
        var submission = _.extend(submissionAttributes, {
            userId: user._id,
            author: user.username,
            submitted: new Date(),
            voters: [],
            votes: 0
        });

        var submissionId = Submissions.insert(submission);

        return {
            _id: submissionId
        };
    },

    submissionUpdate: function (submissionAttributes) {

    }

});