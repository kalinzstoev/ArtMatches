Template.postItem.helpers({
    images: function() {
        if (this.postType == 'visual') {
            return Images.find(
                {'_id': this.filesIdArray[0]}
            )
        }
    },

    hasThumbnail: function() {
        return this.thumbnail != "";
    },

    thumbnail: function() {
        if (this.thumbnail != "") {
            var result = Thumbnails.findOne(
                {'_id': this.thumbnail}
            )
        }
        return result;
    }
});


