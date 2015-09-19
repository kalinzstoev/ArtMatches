Meteor.methods({
    "deleteOwnUserProfile":function(userId) {
        check(userId, String);
        if (userId == Meteor.user()._id){
            Meteor.users.remove(userId);
        }else{
            throw new Meteor.Error('Unauthorized Access', "Access Denied");
        }
    }
});

//A function which makes that every user has all the required predefined options whether created through the standard
//process or through Facebook/Google
Accounts.onCreateUser(function (options, user) {
    if (options.profile)
        if (!user.username){
            user.username = options.profile.name;
        }

    if (options.profile){
        options.profile.thumbnail = "";
        user.profile = options.profile;
    }

    return user;
});

