//Template.postFull.rendered = function (){
//    var dom = document.createElement("DIV");
//    $(".summernote").summernote("insertNode", dom);
//    $(".summernote").code(this.data.formattedText);
//}

Template.postPage.helpers({
    images: function() {
        return Images.find({
            '_id': {$in: this.filesIdArray}
        })
    }
});

Template.postPage.helpers({
    audios: function() {
        return Audios.find({
            '_id': {$in: this.filesIdArray}
        })
    }
});