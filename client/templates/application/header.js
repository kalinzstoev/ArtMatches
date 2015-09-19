Template.header.helpers({
    //returns the thumbnail document for the user profile
    thumbnail: function() {
            return Thumbnails.findOne({_id: Meteor.user().profile.thumbnail})
    },

    //checks if the user has a thumbnail
    hasThumbnail: function() {
        return Meteor.user().profile.thumbnail != "";
    },
});
