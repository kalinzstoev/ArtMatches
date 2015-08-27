Template.commentItem.helpers({
    submittedParsed: function(){
        return moment(this.submitted).format('MMMM Do YYYY, h:mm:ss a');
    }
})