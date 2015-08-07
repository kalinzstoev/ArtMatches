Template.registerHelper('isVisual', function () {
    return this.postType == 'visual';
});

Template.registerHelper('isAudio', function () {
    return this.postType == 'audio';
});

Template.registerHelper('isWritten', function () {
    return this.postType == 'written';
});
