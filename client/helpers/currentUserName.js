Template.registerHelper('currentUserName', function () {
    return Meteor.user() && Slug.slugify(Meteor.user().username);
});