Template.submissionContent.onDestroyed(function(){
    //remove modal on rerouting
    $('#submission-content').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
});

Template.submissionContent.helpers({

    submission:function(){
        var submission = Submissions.findOne({_id: Session.get('submissionContentId')});
        Session.set("submissionObject", submission);
        return submission;
    },

    singleImage: function(content) {
        return Images.findOne({
            '_id': content
        })
    },

    audio: function() {
        return Audios.findOne({_id: this.content})
    },
});

