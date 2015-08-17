Artmatches= new Mongo.Collection('artmatches');

Artmatches.allow({
    update: function(){ return true},
    remove: function(){ return true},
    insert: function(){ return true}
});

Meteor.methods({
    artmatchInsert: function (artmatchAttributes) {
        check(this.userId, String);

        if (artmatchAttributes.type=="visual") {
            check(artmatchAttributes, {
                originalPostId: String,
                type: String,
                title: String,
                userId: String,
                author: String,
                imagesIdArray: [String],
                tags: [String],
                submissionsId: [String]
            });
        }else if(artmatchAttributes.type=="audio") {
            check(artmatchAttributes, {
                originalPostId: String,
                type: String,
                title: String,
                userId: String,
                author: String,
                content: String,
                embed: Boolean,
                tags: [String],
                submissionsId: [String]
            });
        }else{
            check(artmatchAttributes, {
                originalPostId: String,
                type: String,
                title: String,
                userId: String,
                author: String,
                content: String,
                tags: [String],
                submissionsId: [String]
            });
        }

        var artmatch = _.extend(artmatchAttributes, {
            submitted: new Date(),
            commentsCount: 0,
            likers: [],
            likes: 0
        });

        var artmatchId = Artmatches.insert(artmatch);

        return {
            _id: artmatchId
        };
    },

});