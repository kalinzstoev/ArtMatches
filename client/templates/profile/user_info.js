Template.userInfo.helpers({
    postsCount: function(){
        return Session.get('userPostsCount');
    },
    ownInfo: function(){
        return Meteor.userId() == this._id;
    },

    thumbnail: function() {
        return Thumbnails.findOne({_id: this.profile.thumbnail})
    },

    hasThumbnail: function() {
        return this.profile.thumbnail != "";
    },

    gender:function(){return this.profile.gender;},
    age:function(){return this.profile.age;},
    country:function(){return this.profile.country;},
    city:function(){return this.profile.city;},
    description:function(){
        if(this.profile.description!=""){
        return this.profile.description;
        } else{
            return "There is no description for this user."
        }
    }
});

Template.userInfo.onRendered(function(){
    Tracker.autorun(function(){
        Session.set('userPostsCount', Counts.get('userPostsCount'));
    });
});