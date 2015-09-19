//A method which returns the username if a user is logged in
Template.registerHelper('currentUserName', function () {
    return Meteor.user() && Meteor.user().username;
});