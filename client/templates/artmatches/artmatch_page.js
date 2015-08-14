Template.artmatchPage.helpers({
    images: function() {
        return Images.find({
            '_id': {$in: this.imagesIdArray}
        })
    },

    visual: function(content){
        return Images.findOne({
            _id: content
        })
    },

    submissions: function(){
        return Submissions.find({
            '_id': {$in: this.submissionsId}
        })
    },

    posts: function () {
        console.log("in posts")
        return Template.instance().posts();
    }

//I will use array of posts with their content and onCreated
// I will check against all posts if these posts are still present if not the post would be removed from the array
//If the imagesFindOne returns undefined just flag the post as faulty and remove it same for audios. Written it doesn't matter since the content will be denormalized anyway.


    //audios: function() {
    //    return Audios.find({
    //        '_id': {$in: this.filesIdArray}
    //    })
    //},
    //
    //tags: function(){
    //    var tags = this.tags;
    //    tags.forEach(function(part, index) {
    //        tags[index] = " #" + tags[index];
    //    });
    //
    //    return tags;
    //},
    //
    //ownPost: function() {
    //    return this.userId == Meteor.userId();
    //},
    //
    //comments: function() {
    //    return Comments.find({postId: this._id});
    //},
    //
    ////TODO handle a dislike/liked functionality
    //likedClass: function() {
    //    var userId = Meteor.userId();
    //    if (userId && !_.include(this.likers, userId)) {
    //        return 'btn-primary likeable';
    //    } else {
    //        return 'disabled';
    //    }
    //}
});
