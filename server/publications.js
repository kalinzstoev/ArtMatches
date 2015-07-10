Meteor.publish('posts', function() {
    return Posts.find();
});

Meteor.publish('texts', function(){
    return Texts.find();
});