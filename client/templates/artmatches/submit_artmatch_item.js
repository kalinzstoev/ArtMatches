Template.submitArtMatchItem.helpers({
    images: function() {
        if (this.postType == 'visual') {
            return Images.find(
                {'_id': this.filesIdArray[0]}
            )
        }
    }
});