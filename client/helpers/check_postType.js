Template.registerHelper('isVisual', function () {
    return this.postType == 'visual' || this.type == "visual";
});

Template.registerHelper('isAudio', function () {
    return this.postType == 'audio' || this.type == "audio";
});

Template.registerHelper('isWritten', function () {
    return this.postType == 'written' || this.type == "written";
});
