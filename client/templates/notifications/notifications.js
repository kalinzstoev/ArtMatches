Template.notifications.helpers({
    notifications: function() {
        return Notifications.find({userId: Meteor.userId(), read: false});
    },
    notificationCount: function(){
        return Notifications.find({userId: Meteor.userId(), read: false}).count();
    }
});

Template.notificationItem.helpers({
    notificationPostPath: function() {
        return Router.routes.postPage.path({_id: this.postId});
    },

    artmatchPostPath: function(){
        return Router.routes.artmatchPage.path({_id: this.artMatchId});
    },

    isComment: function() {
        return this.type == "comment";
    },

    isMatch: function() {
        return this.type == "match";
    },
});

Template.notificationItem.events({
    'click a': function() {
        Notifications.update(this._id, {$set: {read: true}});
    }
});