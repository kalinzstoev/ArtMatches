Template.artmatchPage.helpers({
    images: function() {
        return Images.find({
            '_id': {$in: this.imagesIdArray}
        })
    },

    visual: function(){
        return Images.findOne({
            _id: this.posts[0].content
        })
    },

    posts: function () {

    }



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
