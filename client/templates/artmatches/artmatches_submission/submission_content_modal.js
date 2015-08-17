Template.submissionContent.onDestroyed(function(){

    //remove modal on rerouting
    $('#submission-content').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
});