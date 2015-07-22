Template.postItem.helpers({
    images: function() {
        return Images.find(
            {'_id': this.filesIdArray[0]}
        )
    }
});

