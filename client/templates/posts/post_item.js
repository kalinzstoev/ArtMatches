Template.postItem.rendered = function (){
    var dom = document.createElement("DIV");
    $(".summernote").summernote("insertNode", dom);
    $(".summernote").code(this.data.formattedText);
}
