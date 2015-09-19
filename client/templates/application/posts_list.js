Template.postsList.onCreated(function(){
    this.postType = new ReactiveVar("");
    this.category = new ReactiveVar("");
    this.activeRoute = new ReactiveVar("newPosts");
    this.searchInput = new ReactiveVar("");
});

Template.postsList.helpers({
    //A helper which checks the current route of the app and selects the appropriate tab in the second navigation bar
    activeRouteClass: function(/* route names */) {
        var args = Array.prototype.slice.call(arguments, 0);
        args.pop();

        var activeRoute = _.any(args, function(name) {
            return Router.current() && Router.current().route.getName() === name
        });

        return activeRoute && 'active';
    },


    isVisual: function(){

        var type = Template.instance().postType.get();

        if ( type == "visual" || type == ""){
            return true;
        }
    },

    isAudio: function(){

        var type = Template.instance().postType.get();

        if (  type == "audio" || type == ""){
            return true;
        }
    },

    isWritten: function(){

        var type = Template.instance().postType.get();

        if (  type == "written" || type == ""){
            return true;
        }
    },

    disableCategories: function(){

        var type = Template.instance().postType.get();

        if ( type == ""){
            return "disabled";
        }
    },

    isTypeSelected: function() {

        var type = Template.instance().postType.get();

        if (type == "") {
            return false;
        }else{
            return true;
        }
    },
});

Template.postsList.events({

    "click #new-posts": function(e, template){
        template.activeRoute.set("newPosts");
        makeQuery();
    },

    "click #best-posts": function(e, template){
        template.activeRoute.set("bestPosts");
        makeQuery();
    },

    "click #discussed-posts": function(e, template){
        template.activeRoute.set("discussedPosts");
        makeQuery();
    },

    "change #post-type": function(e, template){

        template.postType.set($(e.target).val());
        template.category.set("");
        makeQuery();
    },

    "change #category": function(e, template){
        template.category.set($(e.target).val());
        makeQuery();
    }

});

//A function which takes the current state of the reactive var activeRoute, the artype select and the category and
//then routes the application with an appropriate query
var makeQuery = function(){
    var query = "";

    Template.instance().category.get()
    if (!Template.instance().postType.get()=="" && !Template.instance().category.get()=="") {
        query = "postType=" + Template.instance().postType.get() + "&category=" + Template.instance().category.get();

    }else if (!Template.instance().postType.get()=="")
    {
        query = "postType=" + Template.instance().postType.get();

    } else if (!Template.instance().category.get()==""){
        query = "category=" + Template.instance().category.get();
    }
    if (!query){
        Router.go(Template.instance().activeRoute.get());
    }
    else {
        Router.go(Template.instance().activeRoute.get(), {}, {query: query});
    }
}
