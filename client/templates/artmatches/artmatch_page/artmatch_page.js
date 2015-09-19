Template.artmatchPage.helpers({
    images: function() {
        return Images.find({
            '_id': {$in: this.filesIdArray}
        })
    },

    singleImage: function(content) {
        return Images.findOne({
            '_id': content
        })
    },

    audio: function() {
        return Audios.findOne({_id: this.content})
    },

    visual: function(content){
        return Images.findOne({
            _id: content
        })
    },

    submissions: function(){
        return Submissions.find({submittedToPostId: this.originalPostId}, {sort: {votes: -1, submitted: -1, _id: -1}});
    },

    posts: function () {
        return Template.instance().posts();
    },

    bestVisual: function(){
        var bestVisual = Submissions.findOne({submittedToPostId: this.originalPostId, type: "visual"},{sort: {votes: -1, submitted: -1, _id: -1}});
        if (bestVisual!=undefined){
            Session.set("hasVisualSubmission", true);
            return bestVisual;
        }else{
            Session.set("hasVisualSubmission", false);
        }
    },

    bestAudio: function(){
        var bestAudio = Submissions.findOne({submittedToPostId: this.originalPostId, type: "audio"},{sort: {votes: -1, submitted: -1, _id: -1}});
        if (bestAudio !=undefined){
            Session.set("hasAudioSubmission", true);
            return bestAudio;
        }else{
            Session.set("hasAudioSubmission", false);
        }
    },

    bestWritten: function(){
        var bestWritten = Submissions.findOne({submittedToPostId: this.originalPostId, type: "written"},{sort: {votes: -1, submitted: -1, _id: -1}});
        if (bestWritten !=undefined){
            Session.set("hasWrittenSubmission", true);
            return bestWritten;
        }else{
            Session.set("hasWrittenSubmission", false);
        }
    },

    hasVisualSubmission: function(){
        return Session.get("hasVisualSubmission");
    },

    hasAudioSubmission: function(){
        return Session.get("hasAudioSubmission");
    },

    hasWrittenSubmission: function(){
        return Session.get("hasWrittenSubmission");
    },

    visualCount: function(){
        var visualCount = Submissions.find({submittedToPostId: this.originalPostId, type: "visual"}).count();
        Session.set("visualCount", visualCount);
        return visualCount;
    },

    audioCount: function(){
        var audioCount = Submissions.find({submittedToPostId: this.originalPostId, type: "audio"}).count();
        Session.set("audioCount", audioCount);
        return audioCount;
    },

    writtenCount: function(){
        var writtenCount = Submissions.find({submittedToPostId: this.originalPostId, type: "written"}).count();
        Session.set("writtenCount", writtenCount);
        return writtenCount;
    },

});

Template.artmatchPage.onCreated(function(){
    Session.set("submissionContentId", "no submission");
});

Template.artmatchPage.onRendered(function(){

    var visualCount = Session.get("visualCount");
    var audioCount = Session.get("audioCount");
    var writtenCount = Session.get("writtenCount");

    //Makes sure that at least one tab is selected when the template is rendered so the user could see
    //the available submissions
    if (visualCount>0){
        $('#submission-type-tabs a[href="#submission-visual-tab"]').tab('show');
    }else if (audioCount>0){
        $('#submission-type-tabs a[href="#submission-audio-tab"]').tab('show');
    }else if (writtenCount>0){
        $('#submission-type-tabs a[href="#submission-written-tab"]').tab('show');
    }
});