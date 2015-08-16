Template.editUserInfo.onCreated(function() {
    var instance = this;
    instance.thumbnail = new ReactiveVar("");
    instance.thumbnail.set(Meteor.user().profile.thumbnail);
});

Template.editUserInfo.rendered = function(){
    var gender = Meteor.user().profile.gender;
    if (gender=="Male"){
        $(':radio[value="Male"]').attr('checked', 'checked');
    }
    if (gender=="Female"){
        $(':radio[value="Female"]').attr('checked', 'checked');
    }
    $('#age').val(Meteor.user().profile.age);
};


Template.editUserInfo.helpers({

    ages: function(){
        var ages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33,
            34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66,
            67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100];
        return ages;
    },

    isFileUploading: function() {
        return Session.get('isFileUploading');
    },

    thumbnail: function() {
        if (Template.instance().thumbnail.get() != ""){
            return Thumbnails.findOne({_id: Template.instance().thumbnail.get()})
        }
    },

    hasThumbnail: function() {
        return Template.instance().thumbnail.get() != "";
    },
    country:function(){return Meteor.user().profile.country;},
    city:function(){return Meteor.user().profile.city;},
    description:function(){return Meteor.user().profile.description;}

});

Template.editUserInfo.events({

    "change .add_picture": function(e, instance){
        var user = Meteor.user();

        FS.Utility.eachFile(e, function(file) {
            var newFile = new FS.File(file);
            newFile.username = user.username;
            newFile.userId = user._id;
            newFile.userSlug = Slug.slugify(user.username);

            Thumbnails.insert(newFile, function (error, result) {
                if (error) {
                    toastr.error("File upload failed... please try again.");
                } else {

                    Session.set('isFileUploading', true);

                    var intervalHandle = Meteor.setInterval(function () {

                        if (result.hasStored('bigThumbs') && result.hasStored('smallThumbs')) {
                            // File has been uploaded and stored. Can safely display it on the page.
                            toastr.success('Profile picture upload succeeded!');
                            instance.thumbnail.set(result._id);
                            Session.set('isFileUploading', false);
                            // File has stored, close out interval
                            Meteor.clearInterval(intervalHandle);
                        }
                    }, 1000);
                }
            });
        });
    },

    'click .delete-thumbnail': function(e, instance) {
        e.preventDefault();

        var sure = confirm('Are you sure you want to delete this thumbnail?');
        if (sure === true) {
            var thumbnailId = this._id;
            Thumbnails.remove({ _id: thumbnailId }, function(error) {
                if (error) {
                    toastr.error("Delete failed... " + error);
                } else {
                    instance.thumbnail.set("");
                    toastr.success('Picture deleted!');
                }
            })
        }
    },

    'click .delete': function(e, instance) {
        e.preventDefault();

        if (confirm("Do you REALLY want to delete your profile? This operation CANNOT be undone!")) {

            Thumbnails.remove({ _id: instance.thumbnail.get()}, function(error) {
                if (error) {
                    toastr.error("Delete failed... " + error);
                }
            });

            //TODO add to delete all posts and content by that user
            instance.thumbnail.set("");

            var userId = Meteor.user()._id;
            Meteor.call("deleteOwnUserProfile", userId);
            toastr.success("Your profile has been deleted! Sorry to see you go :(");
            Router.go('home');
        }
    },

    'submit form': function(e,instance) {
        e.preventDefault();


        var user = Meteor.user();
        var thumbnail = instance.thumbnail.get();
        var gender = $('#gender-button-group input:radio:checked').val();
        var age = $(e.target).find('[name=age]').val() ;
        var country= $(e.target).find('[name=country]').val() ;
        var city= $(e.target).find('[name=city]').val();
        var description = $(e.target).find('[name=description]').val();



        Meteor.users.update(user._id, {$set: {"profile.thumbnail": thumbnail}});
        Meteor.users.update(user._id, {$set: {"profile.gender": gender}});
        Meteor.users.update(user._id, {$set: {"profile.age": age}});
        Meteor.users.update(user._id, {$set: {"profile.country": country}});
        Meteor.users.update(user._id, {$set: {"profile.city": city}});
        Meteor.users.update(user._id, {$set: {"profile.description": description}});

        toastr.success("Your info was updated successfully!")
        Router.go('userInfo', {username: user.username});

        //Posts.update(currentPostId, {$set: userDetails}, function(error) {
        //    if (error) {
        //        // display the error to the user
        //        throwError(error.reason);
        //    } else {
        //
        //
        //    }
        //
        //},
    }
});