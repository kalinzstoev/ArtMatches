Template.userPosts.events({
    'click #load-more': function (event, instance) {
        event.preventDefault();

        // get current value for limit, i.e. how many posts are currently displayed
        var limit = instance.limit.get();

        // increase limit by 8 and update it
        var increment = 8;
        limit += increment;
        instance.limit.set(limit);
    }
});

Template.userPosts.helpers({
    // the posts cursor
    posts: function () {
        return Template.instance().posts();
    },
    // are there more posts to show?
    hasMorePosts: function () {
        return Template.instance().posts().count() >= Template.instance().limit.get();
    },

    isEmpty: function () {
        return Template.instance().posts().count() == 0;
    }

});


Template.userPosts.onCreated(function () {

  //Initialization

    var instance = this;

    var userId = this.data._id;

    // initialize the reactive variables
    instance.loaded = new ReactiveVar(0);
    instance.limit = new ReactiveVar(8);

    // Autorun

    // will re-run when the "limit" reactive variables changes
    instance.autorun(function () {

        // get the limit
        var limit = instance.limit.get();

        var sort = {submitted: -1, _id: -1}

        // subscribe to the posts publication
        var subscription = instance.subscribe('posts', {userId: userId}, {sort: sort, limit: limit});

        // if subscription is ready, set limit to newLimit
        if (subscription.ready()) {
            instance.loaded.set(limit);
        }
    });

    // Cursor

    instance.posts = function() {
        return Posts.find({}, {limit: instance.loaded.get()});
    }

});
