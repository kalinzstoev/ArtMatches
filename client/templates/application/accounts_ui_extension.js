Template._loginButtonsAdditionalLoggedInDropdownActions.events({
'click #login-buttons-edit-profile': function() {
    Router.go("editUserInfo", {username: Meteor.user().username});
}
});