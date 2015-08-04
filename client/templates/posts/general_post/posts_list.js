Template.postsList.onCreated(function(){
    this.postType = new ReactiveVar("");
    this.category = new ReactiveVar("");
    this.activeRoute = new ReactiveVar();
});

Template.postsList.helpers({
    activeRouteClass: function(/* route names */) {
        var args = Array.prototype.slice.call(arguments, 0);
        args.pop();

        var activeRoute = _.any(args, function(name) {
            return Router.current() && Router.current().route.getName() === name
        });

        return activeRoute && 'active';
    },

    isAll: function(){

        if ( Template.instance().postType.get() == ""){
            return true;
        }
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
    }
});

Template.postsList.events({

    "change #post-type": function(e, template){

        template.postType.set($(e.target).val());
        makeQuery();
    },

    "change #category": function(e, template){
        template.category.set($(e.target).val());
        makeQuery();
    }
});

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
        Router.go(Router.current().route.getName());
    }
    else {
        Router.go(Router.current().route.getName(), {}, {query: query});
    }
}
