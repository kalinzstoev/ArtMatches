Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound',
    waitOn: function() {
        return  Meteor.subscribe('notifications')
    }
});

PostsListController = RouteController.extend({
    template: 'postsList',
    increment: 8,

    postsLimit: function() {
        return parseInt(this.params.postsLimit) || this.increment;
    },

    postType: function(){
        return this.params.query.postType;
    },

    category: function (){
        return this.params.query.category;
    },

    findOptions: function() {
        return {sort: this.sort, limit: this.postsLimit()};
    },
    subscriptions: function() {

        var postType = this.postType();
        var category = this.category();

        if (postType || category){
            this.postsSub = Meteor.subscribe('posts', {postType: postType, category: category}, this.findOptions());
        }else{
            this.postsSub = Meteor.subscribe('posts', {}, this.findOptions());
        }

    },
    posts: function() {
        return Posts.find({}, this.findOptions());

    },
    data: function() {
        var postCount = this.posts().count();
        var hasMore = postCount === this.postsLimit();
        var isEmpty = postCount === 0;
        return {
            isEmpty: isEmpty,
            posts: this.posts(),
            ready: this.postsSub.ready,
            nextPath: hasMore ? this.nextPath() : null
        };
    }
});


NewPostsController = PostsListController.extend({
    sort: {submitted: -1, _id: -1},
    nextPath: function() {
        if(this.postType() || this.category()) {
            var query = makeQuery(this.postType(), this.category());
            return Router.routes.newPosts.path({postsLimit: this.postsLimit() + this.increment}, {query: query})
        } else {
            return Router.routes.newPosts.path({postsLimit: this.postsLimit() + this.increment});
        }
    }
});

BestPostsController = PostsListController.extend({
    sort: {votes: -1, submitted: -1, _id: -1},
    nextPath: function() {
        if(this.postType() || this.category()) {
            var query = makeQuery(this.postType(), this.category());
            return Router.routes.bestPosts.path({postsLimit: this.postsLimit() + this.increment}, {query: query})
        } else {
            return Router.routes.bestPosts.path({postsLimit: this.postsLimit() + this.increment});
        }
    }
});
DiscussedPostsController = PostsListController.extend({
    sort: {commentsCount: -1, submitted: -1, _id: -1},
    nextPath: function() {
        if(this.postType() || this.category()) {
            var query = makeQuery(this.postType(), this.category());
            return Router.routes.discussedPosts.path({postsLimit: this.postsLimit() + this.increment}, {query: query})
        } else {
            return Router.routes.discussedPosts.path({postsLimit: this.postsLimit() + this.increment});
        }
    }
});


//Header routes


Router.route('/user/:username', {
    name: 'userInfo',
    waitOn: function () {
        return [
            Meteor.subscribe('allUserPostsCount', this.params.username),
            Meteor.subscribe('userData', this.params.username)
        ];
    },
    data: function(){
        return Meteor.users.findOne({username: this.params.username});
    }
});

Router.route('/user/:username/edit-info', {name: 'editUserInfo'});

//Router.route('/user/:username/posts', {name: 'userPosts'});

Router.route('/user/:username/posts', {
    name: 'userPosts',
    waitOn: function () {
        return Meteor.subscribe('userData', this.params.username);
    },
    data: function(){
        return Meteor.users.findOne({username: this.params.username});
    }
});


//Post sorting routes
Router.route('/', {
    name: 'home',
    controller: NewPostsController
});

Router.route('/search', {name: 'searchPosts'});


Router.route('/new/:postsLimit?/:postType?', {name: 'newPosts'});
Router.route('/best/:postsLimit?', {name: 'bestPosts'});
Router.route('/discussed/:postsLimit?', {name: 'discussedPosts'});

//Submission routes
Router.route('/submit/visual', {name: 'visualPostSubmit'});
Router.route('/submit/audio', {name: 'audioPostSubmit'});
Router.route('submit/written', {name: 'writtenPostSubmit'});


//Editing routes
Router.route('/posts/:_id/visual-edit', {
    name: 'visualPostEdit',
    waitOn: function() {
        return Meteor.subscribe('singlePost', this.params._id);
    },
    data: function() { return Posts.findOne(this.params._id); }
});

Router.route('/posts/:_id/audio-edit', {
    name: 'audioPostEdit',
    waitOn: function() {
        return Meteor.subscribe('singlePost', this.params._id);
    },
    data: function() { return Posts.findOne(this.params._id); }
});

Router.route('/posts/:_id/written-edit', {
    name: 'writtenPostEdit',
    waitOn: function() {
        return Meteor.subscribe('singlePost', this.params._id);
    },
    data: function() { return Posts.findOne(this.params._id); }
});


Router.route('/posts/:_id', {
    name: 'postPage',
    waitOn: function() {
        return [
            Meteor.subscribe('singlePost', this.params._id),
            Meteor.subscribe('comments', this.params._id)
        ];
    },
    data: function() { return Posts.findOne(this.params._id);}
});

Router.route('/artmatches/:_id', {
    name: 'artmatchPage',
    //waitOn: function() {
    //    return [
    //        Meteor.subscribe('singlePost', this.params._id),
    //        Meteor.subscribe('comments', this.params._id)
    //    ];
    //},
    data: function() { return Artmatches.findOne(this.params._id);}
});

Router.route('/artmatches',
    {
        name:'artmatchesList'
    });

Router.route
var requireLogin = function() {
    if (! Meteor.user()) {
        if (Meteor.loggingIn()) {
            this.render(this.loadingTemplate);
        } else {
            this.render('accessDenied');
        }
    } else {
        this.next();
    }
};

var makeQuery = function (postType, category){
    var query = "";

    if (postType && category){
        ;
        query ="postType=" + postType + "&category=" + category;
    } else if (postType){
        query = "postType=" + postType;
    } else {
        query = "category=" + category;
    }
    return query;
}

Router.onBeforeAction('dataNotFound', {only: 'postPage'});
Router.onBeforeAction(requireLogin, {only: ['editUserInfo','postSubmit', 'visualPostSubmit', 'audioPostSubmit', 'writtenPostSubmit']});
