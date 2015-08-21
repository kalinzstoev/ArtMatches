Template.header.helpers({
    thumbnail: function() {
            return Thumbnails.findOne({_id: Meteor.user().profile.thumbnail})
    },

    hasThumbnail: function() {
        return Meteor.user().profile.thumbnail != "";
    },
});
