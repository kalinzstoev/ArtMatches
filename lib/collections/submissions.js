Submissions = new Mongo.Collection('submissions');

Submissions.allow({
    update: function(){ return true},
    remove: function(){ return true},
    insert: function(){ return true}
});

Meteor.methods({
    submissionInsert: function (submissionAttributes) {
        check(this.userId, String);

        if (submissionAttributes.type == "audio" ){
            check(submissionAttributes, {
                submittedToPostId: String,
                submittedFromPostId: String,
                embed: Boolean,
                title: String,
                type: String,
                content: String,
            });
        } else {
            check(submissionAttributes, {
                submittedToPostId: String,
                submittedFromPostId: String,
                title: String,
                type: String,
                content: String,
            });
        }



        var user = Meteor.user();
        var submission = _.extend(submissionAttributes, {
            userId: user._id,
            author: user.username,
            submitted: new Date(),
            voters: [],
            votes: 0
        });

        var submissionId = Submissions.insert(submission);
        return submissionId;
    },

    vote: function(submissionId) {
        check(this.userId, String);
        check(submissionId, String);

        var affectedSubmission = Submissions.update({
                _id: submissionId,
                voters: {$ne: this.userId}
            },
            {
                $addToSet: {voters: this.userId},
                $inc: {votes: 1}
            });

        if (! affectedSubmission)
            throw new Meteor.Error('invalid', "You weren't able vote on that submission");
    }

});