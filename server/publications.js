Meteor.publish('posts', function (input,options) {
    check(options, {
        sort: Object,
        limit: Number
    });
    check(input, Object);
    return Posts.find(input, options);
});

Meteor.publish('singlePost', function(id) {
    check(id, String)
    return Posts.find(id);
});

Meteor.publish('artmatches', function(){
    return Artmatches.find();
});

Meteor.publish('submissions', function(){
    return Submissions.find();
});


Meteor.publish('images', function(){
    return Images.find();
});

Meteor.publish('audios', function(){
    return Audios.find();
});

Meteor.publish('thumbnails', function(){
    return Thumbnails.find();
});

Meteor.publish('comments', function(postId) {
    check(postId, String);
    return Comments.find({postId: postId});
});

Meteor.publish('notifications', function() {
    return Notifications.find({userId: this.userId, read: false});
});
