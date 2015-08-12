Artmatches= new Mongo.Collection('artmatches');

Artmatches.allow({
    update: function(){ return true},
    remove: function(){ return true},
    insert: function(){ return true}
});

Meteor.methods({
    artmatchInsert: function (artmatchAttributes) {
        check(this.userId, String);

            check(artmatchAttributes, {
                originalPostId: String,
                originalTitle: String,
                originalContent: String,
                imagesIdArray: [String],
                tags: [String],
                posts: [Object],
                postsId: [String]
            });


        var user = Meteor.user();
        var artmatch = _.extend(artmatchAttributes, {
            //userId: user._id, TODO consider multiple authorship
            //author: user.username,
            submitted: new Date(),
            commentsCount: 0,
            likers: [],
            votes: 0
        });

        var artmatchId = Artmatches.insert(artmatch);

        return {
            _id: artmatchId
        };
    },

    artmatchUpdate: function (artmatchAttributes) {

    }

});