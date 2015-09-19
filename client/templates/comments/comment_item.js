Template.commentItem.helpers({
    //A function which uses moment.js
    submittedParsed: function(){
        return moment(this.submitted).format('MMMM Do YYYY, h:mm:ss a');
    }
})