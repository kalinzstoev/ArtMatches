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

    //Checks if the title is too long and truncates it so it doesn't push to other columns
    truncatedTitle: function(){

        if (this.title.length>=26){
            var truncatedTitle = this.title.substring(0,26);
            var lastIndexOfSpace = truncatedTitle.lastIndexOf(" ");
            if (lastIndexOfSpace>0){
                truncatedTitle = truncatedTitle.substring(0, lastIndexOfSpace) + "...";
            }else{
                truncatedTitle = truncatedTitle.substring(0, 26) + "...";
            }
            return truncatedTitle;
        }else{
            return this.title;
        }
    }
});

