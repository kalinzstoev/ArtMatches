Template.artmatchPage.helpers({
    images: function() {
        return Images.find({
            '_id': {$in: this.imagesIdArray}
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
        return Submissions.find({
            '_id': {$in: this.submissionsId}
        })
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

    hasVisualSubmisiion: function(){
        return Session.get("hasVisualSubmission");
    },

    hasAudioSubmisiion: function(){
        return Session.get("hasAudioSubmission");
    },

    hasWrittenSubmisiion: function(){
        return Session.get("hasWrittenSubmission");
    },
});

Template.artmatchPage.onCreated(function(){
    Session.set("submissionContentId", "no submission");
});
