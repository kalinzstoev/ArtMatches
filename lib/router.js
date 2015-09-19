Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound',
    waitOn: function() {
        return  Meteor.subscribe('notifications')
    }
});

//The main controller responsible for the routes "home", "newPosts" "bestPosts" and "discussedPosts"
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


//Returns all posts based on a query submitted from postsList template helper  and sorts them by date
NewPostsController = PostsListController.extend({
    sort: {submitted: -1, _id: -1},
    nextPath: function() {
        //checks if the current route has a query for either the postType or the category
        if(this.postType() || this.category()) {
            var query = makeQuery(this.postType(), this.category());
            return Router.routes.newPosts.path({postsLimit: this.postsLimit() + this.increment}, {query: query})

        } else {
            return Router.routes.newPosts.path({postsLimit: this.postsLimit() + this.increment});
        }
    }
});

//Returns all posts based on a query submitted from the postsList template helper and sorts them by number of likes
BestPostsController = PostsListController.extend({
    sort: {likes: -1, submitted: -1, _id: -1},
    nextPath: function() {
        //checks if the current route has a query for either the postType or the category
        if(this.postType() || this.category()) {
            var query = makeQuery(this.postType(), this.category());
            return Router.routes.bestPosts.path({postsLimit: this.postsLimit() + this.increment}, {query: query})

        } else {
            return Router.routes.bestPosts.path({postsLimit: this.postsLimit() + this.increment});
        }
    }
});

//Returns all posts based on a query submitted from the postsList template helper and sorts them by number of comments
DiscussedPostsController = PostsListController.extend({
    sort: {commentsCount: -1, submitted: -1, _id: -1},
    nextPath: function() {
        //checks if the current route has a query for either the postType or the category
        if(this.postType() || this.category()) {
            var query = makeQuery(this.postType(), this.category());

            return Router.routes.discussedPosts.path({postsLimit: this.postsLimit() + this.increment}, {query: query})
        } else {
            return Router.routes.discussedPosts.path({postsLimit: this.postsLimit() + this.increment});
        }
    }
});


//Header routes

//The route for the fullSize template
Router.route('/images/full-size/:_id', {
    name: 'fullSize',
    data: function() { return Images.findOne(this.params._id);}
});


//The route for the user profile info
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


//The route for editing the user profile info
Router.route('/user/:username/edit-info', {name: 'editUserInfo'});

//The route for viewing all the user's posts
Router.route('/user/:username/posts', {
    name: 'userPosts',
    waitOn: function () {
        return Meteor.subscribe('userData', this.params.username);
    },
    data: function(){
        return Meteor.users.findOne({username: this.params.username});
    }
});

//The route for searching all posts in the database
Router.route('/search', {name: 'searchPosts'});

//The route for the chat function
Router.route('/chat', {name: 'chat'});

//Post sorting routes

//The home routes is the same as the newPosts
Router.route('/', {
    name: 'home',
    controller: NewPostsController
});

//latest posts
Router.route('/new/:postsLimit?/:postType?', {name: 'newPosts'});

//most liked posts
Router.route('/best/:postsLimit?', {name: 'bestPosts'});

//most discussed posts
Router.route('/discussed/:postsLimit?', {name: 'discussedPosts'});

//Submission routes

//submit a visual post
Router.route('/submit/visual', {name: 'visualPostSubmit'});

//submit an audio post
Router.route('/submit/audio', {name: 'audioPostSubmit'});

//submit a written post
Router.route('submit/written', {name: 'writtenPostSubmit'});


//Editing routes


//Each of these routes returns the corresponding post from the database and sends it to the template as data context

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


//Presentation routes

//Post page finds the corresponding post and all of its comments and passes them as data context
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

//ArtMatch page
Router.route('/artmatches/:_id', {
    name: 'artmatchPage',
    data: function() { return Artmatches.findOne(this.params._id);}
});

//The route to see all ArtMatches. It needs to be after artmatchPage because Iron Router routes by degree of specificity
//therefore more general routes should be last and more specific ones first
Router.route('/artmatches',
    {
        name:'artmatchesList'
    });

//A function which checks if the current user is logged in and reroutes to the access denied template if not
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


//A function which takes a postType and category and makes a string query which suitable for quering the mongo database
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

//A routing hook which checks first for the following tempaltes if the user has logged in to access them
Router.onBeforeAction(requireLogin, {only: ['chat','editUserInfo','postSubmit', 'visualPostSubmit', 'audioPostSubmit', 'writtenPostSubmit']});
