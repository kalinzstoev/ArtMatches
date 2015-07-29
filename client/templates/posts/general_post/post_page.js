Template.postPage.helpers({
    images: function() {
        return Images.find({
            '_id': {$in: this.filesIdArray}
        })
    },

    audios: function() {
        return Audios.find({
            '_id': {$in: this.filesIdArray}
        })
    },

    ownPost: function() {
        return this.userId == Meteor.userId();
    },

    isVisual: function() {
        return this.postType == 'visual';
    },

    isAudio: function() {
        return this.postType == 'audio';
    },

    isWritten: function() {
        return this.postType == 'written';
    },

    comments: function() {
        return Comments.find({postId: this._id});
    }
});




