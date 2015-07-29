// Fixture data 
if (Posts.find().count() < 40) {
    var now = new Date().getTime();

    // create two users
    var tomId = Meteor.users.insert({
        profile: { name: 'Tom Coleman' }
    });
    var tom = Meteor.users.findOne(tomId);
    var sachaId = Meteor.users.insert({
        profile: { name: 'Sacha Greif' }
    });
    var sacha = Meteor.users.findOne(sachaId);

    for (var i = 0; i < 40; i++) {
        Posts.insert({
            title: 'Test post #' + i,
            postType: "written",
            author: sacha.profile.name,
            userId: sacha._id,
            submitted: new Date(now - i * 3600 * 1000 + 1),
            commentsCount: 0,
            upvoters: [], votes: 0
        });
    }
}