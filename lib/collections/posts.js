Posts = new Mongo.Collection('posts');

Posts.initEasySearch(['title', 'description','tags', 'text',], {
    'limit' : 24,
    'use' : 'mongo-db'
});

Posts.allow({
    update: function(userId, post) { return ownsDocument(userId, post); },
    remove: function(userId, post) { return ownsDocument(userId, post); }
});

Posts.deny({
    update: function(userId, post, fieldNames) {
        // may only edit the following fields:
        return (_.without(fieldNames, 'title','description', 'category', 'tags', 'type', 'text', 'filesIdArray', 'isFilePresent').length > 0);
    }
});

Posts.deny({
    update: function(userId, post, fieldNames, modifier) {
        if (post.postType == "written") {
            var errors = validateTextPost(modifier.$set);
            return errors.title || errors.category || errors.type || errors.text;
        } else if (post.postType == "visual" || post.postType == "audio") {
            var errors = validateFilePost(modifier.$set);
            return errors.title || errors.category || errors.isFilePresent;

        }
    }
});

validateFilePost = function (post) {
    var errors = {};

    if (!post.title)
        errors.title = "Please fill in a title";

    if (!post.category)
        errors.category = "Please choose a category";

    if (!post.isFilePresent)
        errors.isFilePresent = "Please upload at least one file";

    return errors;
}

validateTextPost = function (post) {
    var errors = {};

    if (!post.title)
        errors.title = "Please fill in a title";

    if (!post.category)
        errors.category = "Please choose a category";

    if (!post.type)
        errors.type = "Please choose a type";

    if (!post.text)
        errors.text = "Please fill in a formatted text";

    return errors;
}

Meteor.methods({
    postFileInsert: function (postAttributes) {
        check(this.userId, String);
        check(postAttributes, {
            postType: String,
            title: String,
            description: String,
            category: String,
            tags: [String],
            filesIdArray: [String],
            isFilePresent: Boolean
        });

        var errors = validateFilePost(postAttributes);

        if (errors.title ||  errors.category || errors.isFilePresent)
            throw new Meteor.Error('invalid-post', "You must fill all required fields");


        var user = Meteor.user();
        var post = _.extend(postAttributes, {
            userId: user._id,
            author: user.username,
            submitted: new Date(),
            commentsCount: 0,
            upvoters: [],
            votes: 0
        });

        var postId = Posts.insert(post);

        return {
            _id: postId
        };
    },

    postTextInsert: function (postAttributes) {
        check(this.userId, String);
        check(postAttributes, {
            postType: String,
            title: String,
            description: String,
            type: String,
            category: String,
            tags: [String],
            text: String
        });
        var clean = UniHTML.purify(this.text);
        this.text = clean;

        var errors = validateTextPost(postAttributes);
        if (errors.title || errors.category || errors.type || errors.text)
            throw new Meteor.Error('invalid-post', "You must fill all required fields");


        var user = Meteor.user();
        var post = _.extend(postAttributes, {
            userId: user._id,
            author: user.username,
            submitted: new Date(),
            commentsCount: 0,
            upvoters: [],
            votes: 0
        });

        var postId = Posts.insert(post);

        return {
            _id: postId
        };
    },

    upvote: function(postId) {
        check(this.userId, String);
        check(postId, String);

        var affected = Posts.update({
            _id: postId,
            upvoters: {$ne: this.userId}
        },
            {
            $addToSet: {upvoters: this.userId},
            $inc: {votes: 1}
        });

        if (! affected)
            throw new Meteor.Error('invalid', "You weren't able to upvote that post");
    }
});

