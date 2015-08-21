Notifications = new Mongo.Collection('notifications');

Notifications.allow({
    update: function(userId, doc, fieldNames) {
        return ownsDocument(userId, doc) &&
            fieldNames.length === 1 && fieldNames[0] === 'read';
    }
});

createCommentNotification = function(comment) {
    var post = Posts.findOne(comment.postId);
    if (comment.userId !== post.userId) {
        Notifications.insert({
            type: 'comment',
            userId: post.userId,
            postId: post._id,
            commentId: comment._id,
            commenterName: comment.author,
            read: false
        });
    }
};

Meteor.methods({
    createSubmissionNotification: function(submissionId) {
        check(submissionId, String);
        var submission = Submissions.findOne(submissionId)
        var artmatch = Artmatches.findOne({originalPostId: submission.submittedToPostId});
        Notifications.insert({
            type: 'match',
            userId: artmatch.userId,
            postId: artmatch.originalPostId,
            artMatchId: artmatch._id,
            submissionId: submission._id,
            submitterName: submission.author,
            read: false
        });
    }
});

