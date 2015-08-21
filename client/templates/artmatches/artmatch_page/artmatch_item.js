Template.artmatchItem.helpers({

    images: function() {
        if (this.type == 'visual') {
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
    },

    truncatedTitle: function(){

        if (this.title.length>=30){
            var truncatedTitle = this.title.substring(0,30);
            var lastIndexOfSpace = truncatedTitle.lastIndexOf(" ");
            if (lastIndexOfSpace>0){
                truncatedTitle = truncatedTitle.substring(0, lastIndexOfSpace) + "...";
            }else{
                truncatedTitle = truncatedTitle.substring(0, 27) + "...";
            }
            return truncatedTitle;
        }else{
            return this.title;
        }
    }
});

