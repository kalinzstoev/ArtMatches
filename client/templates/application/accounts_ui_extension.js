Template._loginButtonsAdditionalLoggedInDropdownActions.events({
    'click #login-buttons-edit-profile': function() {
        Router.go("editUserInfo", {username: Meteor.user().username});
    },

    'click #login-buttons-my-posts': function() {
        Router.go("userPosts", {username: Meteor.user().username});
    },
});