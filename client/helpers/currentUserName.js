Template.registerHelper('currentUserName', function () {
    return Meteor.user() && Meteor.user().username;
});