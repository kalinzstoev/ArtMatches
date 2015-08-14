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
                type: String,
                title: String,
                userId: String,
                author: String,
                content: String,
                imagesIdArray: [String],
                tags: [String],
                submissionsId: [String]
            });

        var artmatch = _.extend(artmatchAttributes, {
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