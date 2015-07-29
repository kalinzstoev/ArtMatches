Template.postItem.helpers({
    //images: function() {
    //    if (this.postType == 'visual') {
    //        return Images.find(
    //            {'_id': this.filesIdArray[0]}
    //        )
    //    }
    //},

    isVisual: function() {
        if (this.postType == 'visual') {
            return true;
        } else {
            return false;
        }
    },

    isAudio: function() {
        if (this.postType == 'audio') {
            return true;
        } else {
            return false;
        }
    },

    isWritten: function() {
        if (this.postType == 'written') {
            return true;
        } else {
            return false;
        }
    }
});


