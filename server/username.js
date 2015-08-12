Accounts.onCreateUser(function (options, user) {
    // We still want the default hook's 'profile' behavior.
    if (options.profile)
    //TODO trigger a modal to enter a username
    //TODO update user data with location and gender
    if (!user.username){
        user.username = options.profile.name;
    }
        user.profile = options.profile;

    return user;
});

